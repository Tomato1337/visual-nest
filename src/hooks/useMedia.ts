"use client"

import { useEffect, useState } from "react"

export default function useMedia(
    queries: string[],
    values: number[],
    defaultValue: number,
) {
    const [value, setValue] = useState(defaultValue)

    useEffect(() => {
        // Проверяем, что мы на клиенте
        if (typeof window !== "undefined") {
            const mediaQueryLists = queries.map((q) => window.matchMedia(q))

            const getValue = () => {
                const index = mediaQueryLists.findIndex((mql) => mql.matches)
                return values[index] || defaultValue
            }

            setValue(getValue)

            const handler = () => setValue(getValue)

            mediaQueryLists.forEach((mql) =>
                mql.addEventListener("change", handler),
            )

            return () =>
                mediaQueryLists.forEach((mql) =>
                    mql.removeEventListener("change", handler),
                )
        }
    }, [queries, values, defaultValue])

    return value
}
