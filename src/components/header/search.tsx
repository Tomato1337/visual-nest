"use client"

import React, { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { SearchIcon } from "lucide-react"
import { useDebounce } from "@uidotdev/usehooks"
import { useQueryState } from "nuqs"
import { TypeSearch, useGlobalStore } from "@/store/global.store"
import { useParams, usePathname } from "next/navigation"

const Search = () => {
    const [search, setSearch] = useQueryState("search", { defaultValue: "" })
    const globalSearch = useGlobalStore((state) => state.search)
    const setGlobalSearch = useGlobalStore((state) => state.setSearch)
    const debouncedSearch = useDebounce(search, 500)
    const pathname = usePathname()

    useEffect(() => {
        if (pathname === TypeSearch.Home) {
            setGlobalSearch({
                value: debouncedSearch,
                typeSearch: TypeSearch.Home,
            })
        } else if (pathname === TypeSearch.Profile) {
            setGlobalSearch({
                value: debouncedSearch,
                typeSearch: TypeSearch.Profile,
            })
        } else {
            console.log("Other page")
        }
    }, [pathname, debouncedSearch, setGlobalSearch])

    useEffect(() => {
        if (globalSearch.typeSearch !== pathname) {
            setSearch("")
        }
    }, [pathname, globalSearch])

    return (
        <div className="relative w-full">
            <Input
                id="input-26"
                className="peer pe-9 ps-10"
                placeholder="Поиск..."
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <SearchIcon size={24} strokeWidth={2} />
            </div>
        </div>
    )
}

export default Search
