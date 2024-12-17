import { create } from "zustand"
import { devtools } from "zustand/middleware"

export enum TypeSearch {
    Home = "/",
    Profile = "/profile",
}

type Search = {
    value: string
    typeSearch: TypeSearch
}

interface GlobalStore {
    search: Search
    setSearch: (search: Search) => void
}

export const useGlobalStore = create(
    devtools<GlobalStore>(
        (set) => ({
            search: {
                value: "",
                typeSearch: TypeSearch.Home,
            },
            setSearch: (search) => set({ search }, undefined, "setSearch"),
        }),
        {
            store: "GlobalStore",
        },
    ),
)
