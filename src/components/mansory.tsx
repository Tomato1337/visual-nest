"use client"

import { Board } from "@prisma/client"
import { useTransition, a } from "@react-spring/web"
import { useMeasure } from "@uidotdev/usehooks"
import NextImage from "next/image"
import { FC, useEffect, useMemo, useState } from "react"

import useMedia from "@/hooks/useMedia"
import { useViewportHeight } from "@/hooks/useViewportHeight"

import { Skeleton } from "./ui/skeleton"

const orientationArr = [350, 400, 580, 750]

const skeletonData = [
    { height: 500 },
    { height: 200 },
    { height: 300 },
    { height: 300 },
    { height: 300 },
    { height: 500 },
    { height: 600 },
    { height: 700 },
    { height: 480 },
    { height: 320 },
    { height: 620 },
    { height: 680 },
    { height: 490 },
].map((item, index) => ({
    ...item,
    id: index,
    width: 0,
}))

export interface MasonryItem {
    item: Board
    css: string
    height?: number
    width?: number
    x?: number
    y?: number
}

interface MasonryImagesProps {
    data: MasonryItem[]
    page: number
    isLoadingDOMImages: boolean
    setIsLoadingDOMImages: (value: boolean) => void
    error: any
    isFetching: boolean
}

const MasonryImages: FC<MasonryImagesProps> = ({
    data,
    isFetching,
    error,
    setIsLoadingDOMImages,
    page,
}) => {
    const columns = useMedia(
        [
            "(min-width: 1500px)",
            "(min-width: 1000px)",
            "(min-width: 600px)",
            "(min-width: 400px)",
        ],
        [5, 4, 3, 2],
        1,
    )
    const heightViewport = useViewportHeight()
    const [ref, { width }] = useMeasure()

    const [items, setItems] = useState<MasonryItem[]>(data)

    useEffect(() => {
        let isMounted = true
        setIsLoadingDOMImages(true)
        Promise.all<MasonryItem>(
            data.map((item) => {
                return new Promise<MasonryItem>((resolve) => {
                    const img = new Image()
                    img.src = item.css
                    img.onload = () => {
                        resolve({
                            ...item,
                            height: Math.min(img.height, heightViewport * 1.2),
                            width: img.width,
                        })
                    }
                    img.onerror = () => {
                        // Обработка ошибки загрузки изображения
                        resolve({
                            ...item,
                            height: orientationArr[
                                Math.round(
                                    Math.random() * orientationArr.length,
                                )
                            ],
                            width: orientationArr[
                                Math.round(
                                    Math.random() * orientationArr.length,
                                )
                            ],
                        }) // Значения по умолчанию
                    }
                })
            }),
        )
            .then((itemsWithSizes) => {
                if (isMounted) {
                    setItems(itemsWithSizes)
                }
            })
            .finally(() => {
                setIsLoadingDOMImages(false)
            })
        return () => {
            isMounted = false
        }
    }, [data, setIsLoadingDOMImages])

    const [heights, gridItems] = useMemo(() => {
        const heights = new Array(columns).fill(0) // Each column gets a height starting with zero
        const gridItems = items.map((child, _) => {
            const column = heights.indexOf(Math.min(...heights)) // Basic masonry-grid placing, puts tile into the smallest column using Math.min
            const x = (width! / columns) * column // x = container width / number of columns * column index,
            const y =
                (heights[column] += (child.height || 0) / 2) -
                (child.height || 0) / 2 // y = it's just the height of the current column
            return {
                ...child,
                x,
                y,
                width: width! / columns,
                height: (child.height || 0) / 2,
            }
        })
        return [heights, gridItems]
    }, [columns, items, width])

    const transitions = useTransition(gridItems, {
        key: (item: MasonryItem) => item.item.id,
        from: ({ x, y, width, height }) => ({
            x,
            y,
            width,
            height,
            opacity: 0,
        }),
        enter: ({ x, y, width, height }) => ({
            x,
            y,
            width,
            height,
            opacity: 1,
        }),
        update: ({ x, y, width, height }) => ({ x, y, width, height }),
        leave: { height: 0, opacity: 0 },
        config: { mass: 5, tension: 500, friction: 100 },
        trail: 25,
    })

    const [skeletonHeights, skeletonItems] = useMemo(() => {
        if (!width) return [[], []]
        const heights = new Array(columns).fill(0)
        const items = skeletonData.map((child) => {
            const column = heights.indexOf(Math.min(...heights))
            const x = (width / columns) * column
            const y = heights[column]
            heights[column] += child.height
            return {
                ...child,
                x,
                y,
                width: width / columns,
            }
        })
        return [heights, items]
    }, [columns, width])

    return (
        <>
            <div
                ref={ref}
                className="relative size-full min-h-screen"
                style={{ height: Math.max(...skeletonHeights, ...heights) }}
            >
                {error ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-red-500">{error?.message}</p>
                    </div>
                ) : null}

                {transitions((style, item) => (
                    <a.div
                        style={style}
                        className="absolute p-2 [will-change:transform,width,height,opacity]"
                    >
                        <div className="relative size-full cursor-pointer overflow-hidden rounded-2xl text-[10px] uppercase leading-[10px] shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)] transition-all duration-300 hover:scale-[101%] hover:shadow-[0px_20px_50px_-10px_hsl(var(--primary)/0.35)]">
                            <NextImage
                                src={`${item.css}?auto=compress&dpr=1&h=300&w=300`}
                                alt={item.item.title}
                                fill
                                loading="lazy"
                                sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
                                className="rounded-2xl object-cover"
                            />
                        </div>
                    </a.div>
                ))}

                {/* First view skeleton */}
                {isFetching &&
                    page === 1 &&
                    skeletonItems.map((item) => (
                        <div
                            key={item.id}
                            className={`absolute p-2 `}
                            style={{
                                transform: `translate(${item.x}px, ${item.y}px)`,
                                width: item.width,
                                height: item.height,
                            }}
                        >
                            <Skeleton className="size-full animate-pulse rounded-3xl" />
                        </div>
                    ))}
            </div>
        </>
    )
}

export default MasonryImages
