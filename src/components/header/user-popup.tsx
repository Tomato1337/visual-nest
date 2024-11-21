import { PopoverContent } from "@radix-ui/react-popover"
import { DoorOpenIcon, SettingsIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { ReactNode } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { signOut } from "../../../auth"
import { Popover, PopoverTrigger } from "../ui/popover"

import DialogExit from "./dialog-exit"

interface UserPopupProps {
    user: {
        name: string | undefined
        email: string | undefined
        avatarUrl: string | undefined
    }
    trigger: ReactNode
}

export const UserPopup = ({ user, trigger }: UserPopupProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent className="z-50 rounded-3xl bg-primary-foreground p-4 shadow-2xl">
                <div className="mb-4 flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start"
                    >
                        <Link href="/profile">
                            <UserIcon />
                            Профиль
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start"
                    >
                        <Link href="/settings">
                            <SettingsIcon />
                            Настройки
                        </Link>
                    </Button>
                    <form
                        action={async () => {
                            "use server"
                            await signOut()
                        }}
                    >
                        <DialogExit>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                            >
                                <DoorOpenIcon />
                                Выйти
                            </Button>
                        </DialogExit>
                    </form>
                </div>
            </PopoverContent>
        </Popover>
    )
}
