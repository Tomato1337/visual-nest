"use client"

import { useIntersectionObserver } from "@uidotdev/usehooks"
import { FrownIcon, Loader2Icon, SmileIcon } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import MasonryImages from "@/components/mansory"
import { BoardWithUser } from "@/types"
import { useGlobalStore } from "@/store/global.store"
import { set } from "zod"

const HomePage = () => {
    const search = useGlobalStore((state) => state.search)
    const [page, setPage] = useState(1)
    const [boards, setBoards] = useState<BoardWithUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingDOMImages, setIsLoadingDOMImages] = useState(true)
    const [firstRender, setFirstRender] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)

    const controllerRef = useRef<AbortController | null>(null)

    const [ref, entry] = useIntersectionObserver({
        threshold: 0.1,
        rootMargin: "8px",
        root: null,
    })

    const fetchImages = async () => {
        setIsLoading(true)
        setError(null)

        if (controllerRef.current) {
            controllerRef.current.abort()
        }

        const controller = new AbortController()
        controllerRef.current = controller
        const signal = controller.signal

        try {
            const res = await fetch(
                `/api/boards?page=${page}&search=${search.value}`,
                { signal },
            )
            const data = await res.json()
            // почему-то происходит дублирование изображений
            setBoards((prevBoards) => {
                if (page === 1) {
                    return data.images
                } else {
                    const combinedBoards = [...prevBoards, ...data.images]
                    const uniqueBoards = combinedBoards.filter(
                        (board, index, self) =>
                            index === self.findIndex((b) => b.id === board.id),
                    )
                    return uniqueBoards
                }
            })

            setHasMore(data.hasMore)
            setIsLoading(false)
            setFirstRender(false)
        } catch (err: any) {
            if (err.name !== "AbortError") {
                console.error("Ошибка при загрузке изображений:", err)
                setError("Не удалось загрузить изображения.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchImages()

        return () => {
            if (controllerRef.current) {
                controllerRef.current.abort()
            }
        }
    }, [page, search.value])

    useEffect(() => {
        setPage(1)
        setIsLoading(true)
        setIsLoadingDOMImages(true)
        setBoards([])
    }, [search.value])

    useEffect(() => {
        if (
            entry?.isIntersecting &&
            hasMore &&
            !isLoading &&
            !isLoadingDOMImages &&
            boards.length > 0
        ) {
            setIsLoading(true)
            setPage((prev) => prev + 1)
        }
    }, [entry, isLoading, hasMore])

    const transformData = useMemo(
        () =>
            boards.map((item) => ({
                item,
                css: item.image,
            })),
        [boards],
    )

    return (
        <div className="mt-4">
            {boards.length === 0 &&
            !isLoading &&
            !isLoadingDOMImages &&
            !firstRender &&
            !error ? (
                <div className="h-screen w-full flex justify-center flex-col gap-3 items-center text-muted-foreground font-bold text-xl">
                    <FrownIcon size={96} />
                    Нет изображений
                </div>
            ) : (
                <MasonryImages
                    page={page}
                    isFirstRender={firstRender}
                    isFetching={isLoading}
                    isLoadingDOMImages={isLoadingDOMImages}
                    setIsLoadingDOMImages={setIsLoadingDOMImages}
                    error={error}
                    setError={setError}
                    data={transformData}
                />
            )}

            {error && (
                <div className="h-screen w-full flex justify-center flex-col gap-3 items-center text-destructive font-bold text-xl">
                    <FrownIcon size={96} />
                    {error}
                </div>
            )}

            {(isLoading || isLoadingDOMImages) && page > 1 && hasMore && (
                <div className="mt-4 flex justify-center">
                    <Loader2Icon size={32} className="animate-spin" />
                </div>
            )}
            <div className="" ref={ref}></div>
        </div>
    )
}

export default HomePage
