import { EyeIcon } from "lucide-react"
import Link from "next/link"
import React, { ReactNode } from "react"

const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center space-y-6">
            <Link
                href={"/"}
                className=" flex items-center gap-2 transition-all duration-300 hover:scale-[103%]"
            >
                <EyeIcon className="h-full w-12 text-primary" />
                <h1 className="text-3xl font-bold text-primary">VisualNest</h1>
            </Link>
            {children}
        </div>
    )
}

export default AuthLayout
