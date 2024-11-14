import { ReactNode } from "react"

import Navbar from "@/components/navbar"

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="p-4">
            <Navbar />
            {children}
        </div>
    )
}

export default Layout
