"use client"

import { useTransition, a } from "@react-spring/web"
import { useMeasure } from "@uidotdev/usehooks"
import { useEffect, useMemo, useState } from "react"

import useMedia from "@/hooks/useMedia"

import { Skeleton } from "./ui/skeleton"

const data = [
    {
        css: "https://images.pexels.com/photos/416430/pexels-photo-416430.jpeg",
        height: 1200,
    },
    {
        css: "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg",
        height: 300,
    },
    {
        css: "https://images.pexels.com/photos/911738/pexels-photo-911738.jpeg",
        height: 300,
    },
    {
        css: "https://images.pexels.com/photos/358574/pexels-photo-358574.jpeg",
        height: 300,
    },
    {
        css: "https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg",
        height: 300,
    },
    {
        css: "https://images.pexels.com/photos/96381/pexels-photo-96381.jpeg",
        height: 300,
    },
    {
        css: "https://images.pexels.com/photos/1005644/pexels-photo-1005644.jpeg",
        height: 200,
    },
    {
        css: "https://images.pexels.com/photos/227675/pexels-photo-227675.jpeg",
        height: 300,
    },
    {
        css: "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg",
        height: 200,
    },
    {
        css: "https://images.pexels.com/photos/327482/pexels-photo-327482.jpeg",
        height: 400,
    },
    {
        css: "https://images.pexels.com/photos/2736834/pexels-photo-2736834.jpeg",
        height: 200,
    },
    {
        css: "https://images.pexels.com/photos/249074/pexels-photo-249074.jpeg",
        height: 150,
    },
    {
        css: "https://images.pexels.com/photos/310452/pexels-photo-310452.jpeg",
        height: 400,
    },
    {
        css: "https://images.pexels.com/photos/380337/pexels-photo-380337.jpeg",
        height: 200,
    },
]

// const orientationArr = [
//     {
//         width: 350,
//         height: 200,
//     },
//     {
//         width: 580,
//         height: 300,
//     },
//     {
//         width: 750,
//         height: 400,
//     },
// ]

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

interface MasonryItem {
    css: string
    height: number
    width?: number
    x?: number
    y?: number
}

const MasonryImages = () => {
    const columns = useMedia(
        ["(min-width: 1500px)", "(min-width: 1000px)", "(min-width: 600px)"],
        [5, 4, 3],
        2,
    )
    const [ref, { width }] = useMeasure()

    const [items, setItems] = useState<MasonryItem[]>(data)

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let isMounted = true
        Promise.all<MasonryItem>(
            data.map((item) => {
                return new Promise<MasonryItem>((resolve) => {
                    const img = new Image()
                    img.src = item.css
                    img.onload = () => {
                        resolve({
                            ...item,
                            height: img.height / 2,
                            width: img.width,
                        })
                    }
                    img.onerror = () => {
                        // Обработка ошибки загрузки изображения
                        resolve({ ...item, height: 200, width: 200 }) // Значения по умолчанию
                    }
                })
            }),
        ).then((itemsWithSizes) => {
            if (isMounted) {
                setItems(itemsWithSizes)
                setIsLoading(false)
            }
        })
        return () => {
            isMounted = false
        }
    }, [data])

    console.log(items)

    const [heights, gridItems] = useMemo(() => {
        const heights = new Array(columns).fill(0) // Each column gets a height starting with zero
        const gridItems = items.map((child, i) => {
            const column = heights.indexOf(Math.min(...heights)) // Basic masonry-grid placing, puts tile into the smallest column using Math.min
            const x = (width! / columns) * column // x = container width / number of columns * column index,
            const y = (heights[column] += child.height / 2) - child.height / 2 // y = it's just the height of the current column
            return {
                ...child,
                x,
                y,
                width: width! / columns,
                height: child.height / 2,
            }
        })
        return [heights, gridItems]
    }, [columns, items, width])
    // Hook6: Turn the static grid values into animated transitions, any addition, removal or change will be animated
    const transitions = useTransition(gridItems, {
        key: (item: MasonryItem) => item.css,
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
        <div
            ref={ref}
            className="relative size-full min-h-screen"
            style={{ height: Math.max(...skeletonHeights) }}
        >
            {isLoading
                ? skeletonItems.map((item) => (
                      <div
                          key={item.id}
                          className="absolute p-2"
                          style={{
                              transform: `translate(${item.x}px, ${item.y}px)`,
                              width: item.width,
                              height: item.height,
                          }}
                      >
                          <Skeleton className="size-full animate-pulse rounded-3xl" />
                      </div>
                  ))
                : transitions((style, item) => (
                      <a.div
                          style={style}
                          className="absolute p-2 [will-change:transform,width,height,opacity]"
                      >
                          <div
                              className="relative size-full cursor-pointer overflow-hidden rounded-2xl bg-cover bg-center text-[10px] uppercase leading-[10px] shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)] transition-all duration-300 hover:shadow-[0px_20px_50px_-10px_rgba(0,0,0,0.35)]"
                              style={{
                                  backgroundImage: `url(${item.css}?auto=compress&dpr=2&h=1000&w=1000)`,
                              }}
                          />
                      </a.div>
                  ))}
        </div>
    )
}

export default MasonryImages
