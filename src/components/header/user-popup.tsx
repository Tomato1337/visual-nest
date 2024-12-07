"use client"

import { PopoverContent } from "@radix-ui/react-popover"
import { a, useSpring } from "@react-spring/web"
import { DoorOpenIcon, SettingsIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { ReactNode, useEffect, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { Popover, PopoverTrigger } from "../ui/popover"

import DialogExit from "./dialog-exit"

interface UserPopupProps {
    user: {
        name: string | undefined
        email: string | undefined
        avatarUrl: string | undefined
    }
    trigger: ReactNode
    handleSignOut: () => void
}

export const UserPopup = ({ user, trigger, handleSignOut }: UserPopupProps) => {
    const [open, setOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    const styles = useSpring({
        opacity: open ? 1 : 0,
        transform: open ? "scale(1)" : "scale(0.9)",
        config: { tension: 300, friction: 20 },
        onRest: () => {
            if (!open) {
                setIsVisible(false)
            }
        },
    })

    useEffect(() => {
        if (open) {
            setIsVisible(true)
        }
    }, [open])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            {isVisible && (
                <PopoverContent forceMount className="z-50" asChild>
                    {/* FIXME: Исправить в будущем. a.div возвращает forwardRef, а forwardRef в React 19 заменён на обычный ref. Разработчики react-spring ещё не выпустили новую адаптированную версию своей библиотеки под react 19 */}
                    {/* @ts-expect-error */}
                    <a.div
                        style={styles}
                        className="z-50 rounded-3xl bg-primary-foreground p-4 shadow-2xl"
                    >
                        <div className="mb-4 flex items-center space-x-4">
                            <Avatar className="border">
                                <AvatarImage
                                    src={user?.avatarUrl}
                                    alt={user?.name}
                                    className="object-cover"
                                />
                                <AvatarFallback>
                                    {user?.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold">{user.name}</h3>
                                <p className="text-sm text-gray-500">
                                    {user.email}
                                </p>
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
                            <form id="signout-form" action={handleSignOut}>
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
                    </a.div>
                </PopoverContent>
            )}
        </Popover>
    )
}
