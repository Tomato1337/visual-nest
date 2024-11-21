import { EyeIcon, PlusIcon } from "lucide-react"
import { Search } from "lucide-react"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

import { UserPopup } from "./user-popup"

const Navbar = () => {
    return (
        <nav className="flex items-center gap-8">
            <Link href={"/"} className="flex items-center gap-2 ">
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
            <UserPopup
                user={{
                    name: "John Doe",
                    email: "sdf@mail.ru",
                    avatarUrl: "https://randomuser.me/api/port",
                }}
                trigger={
                    <Avatar className="size-12 cursor-pointer">
                        <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                }
            />
        </nav>
    )
}

export default Navbar
