"use client"

import Link from "next/link"
import { FormEvent, useActionState, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormRegisterType, registerAction } from "@/lib/actions"

const RegisterPage = () => {
    const initialState: FormRegisterType = {
        errors: {},
        message: null,
    }
    const [formState, formAction, isPending] = useActionState(
        registerAction,
        initialState,
    )
    const [visibleInfoMessage, setVisibleInfoMessage] = useState(false)

    useEffect(() => {
        if (formState?.message) {
            setVisibleInfoMessage(true)
            const timer = setTimeout(() => {
                setVisibleInfoMessage(false)
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [formState])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        await formAction(formData)
    }

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Регистрация</CardTitle>
                    <CardDescription>
                        Введите свои учетные данные для создания новой учетной.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Имя</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                />
                                {formState?.errors?.name && (
                                    <p className="text-sm text-red-500">
                                        {formState?.errors.name.join(", ")}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                />
                                {formState?.errors?.email && (
                                    <p className="text-sm text-red-500">
                                        {formState?.errors.email.join(", ")}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Пароль</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                />
                                {formState?.errors?.password && (
                                    <p className="text-sm text-red-500">
                                        {formState?.errors.password.join(", ")}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <Button
                            className="w-full"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending
                                ? "Регистрация..."
                                : "Зарегистрироваться"}
                        </Button>
                        {visibleInfoMessage && formState?.message && (
                            <p className="mt-2 text-sm text-primary">
                                {formState.message}
                            </p>
                        )}
                        <p className="mt-3 text-center text-sm">
                            У вас уже есть аккаунт?{" "}
                            <Link
                                href="/auth/login"
                                className="text-blue-600 hover:underline"
                            >
                                <Button variant="link">Авторизоваться</Button>
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default RegisterPage
