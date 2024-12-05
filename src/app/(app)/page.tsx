"use client"

import { Board } from "@prisma/client"
import { useIntersectionObserver } from "@uidotdev/usehooks"
import { Loader2Icon } from "lucide-react"
import { useEffect, useState } from "react"

import MasonryImages from "@/components/mansory"

const HomePage = () => {
    const [page, setPage] = useState(1)
    const [boards, setBoards] = useState<Board[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingDOMImages, setIsLoadingDOMImages] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)

    const [ref, entry] = useIntersectionObserver({
        threshold: 0.1,
        rootMargin: "8px",
        root: null,
    })

    useEffect(() => {
        const fetchImages = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const res = await fetch(`/api/boards?page=${page}`)
                const data = await res.json()

                // почему-то происходит дублирование изображений
                setBoards((prevBoards) => {
                    const combinedBoards = [...prevBoards, ...data.images]
                    const uniqueBoards = combinedBoards.filter(
                        (board, index, self) =>
                            index === self.findIndex((b) => b.id === board.id),
                    )
                    return uniqueBoards
                })

                setHasMore(data.hasMore)
                setIsLoading(false)
            } catch (err: any) {
                console.error("Ошибка при загрузке изображений:", err)
                setError("Не удалось загрузить изображения.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchImages()
    }, [page])

    useEffect(() => {
        if (
            entry?.isIntersecting &&
            hasMore &&
            !isLoading &&
            !isLoadingDOMImages
        ) {
            setIsLoading(true)
            setPage((prev) => prev + 1)
        }
    }, [entry, isLoading, hasMore])

    const transformData = boards.map((item) => ({
        item,
        css: item.image,
    }))

    return (
        <div className="mt-4 min-h-screen">
            <MasonryImages
                page={page}
                isFetching={isLoading}
                isLoadingDOMImages={isLoadingDOMImages}
                setIsLoadingDOMImages={setIsLoadingDOMImages}
                error={error}
                data={transformData}
            />
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
