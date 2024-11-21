"use client"

import { FC, ReactNode } from "react"

import {
    Card,
    CardDescription,
    CardHeader,
    CardFooter,
    CardTitle,
    CardContent,
} from "@/components/ui/card"

interface AuthWrapperProps {
    content: ReactNode
    footer: ReactNode
    title: ReactNode
    description: ReactNode
    action: () => void
}

const AuthWrapper: FC<AuthWrapperProps> = ({
    content,
    footer,
    title,
    description,
    action,
}) => {
    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <form action={action}>
                <CardContent>{content}</CardContent>
                <CardFooter className="flex flex-col">{footer}</CardFooter>
            </form>
        </Card>
    )
}

export default AuthWrapper
