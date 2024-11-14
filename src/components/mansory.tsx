"use client"

import { useEffect, useState } from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

const images = [
    "https://picsum.photos/200/400?random=1",
    "https://picsum.photos/200/300?random=2",
    "https://picsum.photos/200/200?random=3",
    "https://picsum.photos/200/300?random=4",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0dUpogET0JGyreA7PTOggP5ShdflSUSeCaA&s",
    "https://picsum.photos/200/400?random=5",
    "https://picsum.photos/200/200?random=6",
    "https://picsum.photos/200/300?random=7",
    "https://picsum.photos/200/400?random=8",
    "https://picsum.photos/200/300?random=9",
    "https://picsum.photos/200/200?random=10",
    "https://picsum.photos/200/400?random=11",
    "https://picsum.photos/200/300?random=12",
]
const columnsBp = {
    350: 1,
    580: 2,
    750: 3,
    1200: 4,
    1440: 5,
    2560: 6,
}

const MasonryImages = () => {
    // const items = useMemo(() => getItems(data), [data])
    const [_, setWindowWidth] = useState(window.innerWidth)

    // Без этого useEffect, при изменении ширины окна, колонки не будут пересчитываться
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <section>
            <ResponsiveMasonry columnsCountBreakPoints={columnsBp}>
                <Masonry gutter={"8px"} className="relative flex">
                    {images.map((item, i) => (
                        <div
                            className="w-full overflow-hidden rounded-2xl"
                            key={i}
                        >
                            <img
                                src={item}
                                alt=""
                                className="block w-full cursor-pointer transition-all hover:scale-110"
                            />
                        </div>
                    ))}
                </Masonry>
            </ResponsiveMasonry>
        </section>
    )
}

export default MasonryImages
