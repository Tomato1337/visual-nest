import { ReactNode } from "react"

import Navbar from "@/components/header/navbar"

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="relative">
            <div className="fixed isolate z-10 w-full bg-white/90 px-4 py-3">
                <Navbar />
            </div>
            <div className="px-4 py-16">{children}</div>
        </div>
    )
}

export default Layout
