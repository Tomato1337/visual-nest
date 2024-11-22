"use client"

import { FC, ReactNode } from "react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DialogExitProps {
    children: ReactNode
    handleSubmit: () => void
}

const DialogExit: FC<DialogExitProps> = ({ children, handleSubmit }) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Вы действительно хотите выйти?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        После выхода вы сможете войти в свой аккаунт снова.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Отменить</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit}>
                        Выйти
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DialogExit
