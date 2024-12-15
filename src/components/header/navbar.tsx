import { EyeIcon, PlusIcon, UserIcon } from "lucide-react"
import { Suspense } from "react"

import { Search } from "lucide-react"
import { redirect } from "next/navigation"
import { auth, signOut } from "../../../auth"
import { CreateBoard } from "../create-board"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Skeleton } from "../ui/skeleton"

import { Link } from "next-view-transitions"
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
        <nav className=" flex items-center gap-4 sm:gap-8">
            <Link
                href={"/"}
                className="flex items-center gap-2 transition-all duration-300 hover:scale-[103%]"
            >
                <EyeIcon className="h-full w-12 text-primary" />
                <h1 className="hidden sm:block text-3xl font-bold text-primary">
                    VisualNest
                </h1>
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
            <CreateBoard user={user}>
                <Button className="hidden sm:flex group">
                    <PlusIcon
                        className="size-12 p-0 transition group-hover:scale-125"
                        size={24}
                        strokeWidth={2}
                    />
                    <p className="hidden md:block">Новое изображение</p>
                </Button>
            </CreateBoard>
            <Suspense
                fallback={<Skeleton className="size-[48px] rounded-full" />}
            >
                {user ? (
                    <UserPopup
                        user={{
                            name: user?.name || undefined,
                            email: user?.email || undefined,
                            avatarUrl: user?.image || undefined,
                        }}
                        handleSignOut={handleSignOut}
                        trigger={
                            <Avatar className="size-12 cursor-pointer border text-secondary text-lg">
                                <AvatarImage
                                    src={user?.image || ""}
                                    alt="@shadcn"
                                    className="object-cover"
                                />
                                <AvatarFallback className="bg-primary">
                                    {user?.name?.toUpperCase().slice(0, 1)}
                                </AvatarFallback>
                            </Avatar>
                        }
                    />
                ) : (
                    <Link href="/auth/login">
                        <Avatar className="size-12 cursor-pointer">
                            <AvatarFallback className="bg-primary">
                                <UserIcon className="text-secondary" />
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                )}
            </Suspense>
        </nav>
    )
}

export default Navbar
