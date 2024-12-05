"use client"

import { useEffect, useState } from "react"

export const useViewportHeight = () => {
    const [height, setHeight] = useState(0)

    useEffect(() => {
        const updateHeight = () => {
            setHeight(window.innerHeight)
        }

        updateHeight()

        window.addEventListener("resize", updateHeight)

        return () => window.removeEventListener("resize", updateHeight)
    }, [])

    return height
}
