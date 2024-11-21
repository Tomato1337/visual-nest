"use client"

import { PopoverContent } from "@radix-ui/react-popover"
import Link from "next/link"
import { ReactNode } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { Popover, PopoverTrigger } from "../ui/popover"

interface UserPopupProps {
    user: {
        name: string
        email: string
        avatarUrl: string
    }
    // onClose: () => void
    trigger: ReactNode
}

export const UserPopup = ({ user, trigger, onClose }: UserPopupProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent className="z-50 rounded-3xl bg-primary-foreground p-4 shadow-2xl">
                <div className="mb-4 flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
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
                        <Link href="/profile">Профиль</Link>
                    </Button>
                    <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start"
                    >
                        <Link href="/settings">Настройки</Link>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
