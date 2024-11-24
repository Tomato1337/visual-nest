import { EyeIcon, PlusIcon, UserIcon } from "lucide-react"
import { Search } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

import { auth, signOut } from "../../../auth"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Skeleton } from "../ui/skeleton"

import { UserPopup } from "./user-popup"

const Navbar = async () => {
    const session = await auth()
    const user = session?.user
    console.log(user)

    const handleSignOut = async () => {
        "use server"
        await signOut()
    }

    return (
        <nav className="flex items-center gap-8">
            <Link
                href={"/"}
                className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
            >
                <EyeIcon className="h-full w-12 text-primary" />
                <h1 className="text-3xl font-bold text-primary">VisualNest</h1>
            </Link>
            <div className="relative w-full">
                <Input
                    id="input-26"
                    className="peer pe-9 ps-10"
                    placeholder="Поиск..."
                    type="search"
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                    <Search size={24} strokeWidth={2} />
                </div>
            </div>
            <Button className="group">
                <PlusIcon
                    className="size-12 p-0 transition group-hover:scale-125"
                    size={24}
                    strokeWidth={2}
                />
                Новая доска
            </Button>
            <Suspense
                fallback={<Skeleton className="size-[48px] rounded-full" />}
            >
                {user ? (
                    <UserPopup
                        user={{
                            name: user?.name || undefined,
                            email: user?.email || undefined,
                            avatarUrl: "",
                        }}
                        handleSignOut={handleSignOut}
                        trigger={
                            <Avatar className="size-12 cursor-pointer">
                                <AvatarImage src="" alt="@shadcn" />
                                <AvatarFallback>
                                    {user?.name?.toUpperCase().slice(0, 1)}
                                </AvatarFallback>
                            </Avatar>
                        }
                    />
                ) : (
                    <Avatar className="size-12 cursor-pointer">
                        <AvatarFallback>
                            <Link href="/auth/login">
                                <UserIcon />
                            </Link>
                        </AvatarFallback>
                    </Avatar>
                )}
            </Suspense>
        </nav>
    )
}

export default Navbar
