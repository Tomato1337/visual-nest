"use client"

import Link from "next/link"
import { useActionState, useEffect, useState } from "react"

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
import { FormLoginType, loginAction } from "@/lib/actions"
import { cn } from "@/lib/utils"

const LoginPage = () => {
    const [valuesState, setValuesState] = useState<FormLoginType>({
        state: {
            email: "",
            password: "",
        },
        errors: {},
        message: null,
    })
    const [formState, formAction, isPending] = useActionState(
        loginAction,
        valuesState,
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

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Авторизация</CardTitle>
                    <CardDescription>
                        Введите свои учетные данные для доступа к вашей учетной
                        записи.
                    </CardDescription>
                </CardHeader>
                <form
                    action={async (formData) => {
                        await formAction(formData)
                    }}
                >
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={valuesState?.state?.email}
                                    onChange={(e) => {
                                        setValuesState({
                                            ...valuesState,
                                            state: {
                                                ...valuesState.state,
                                                email: e.target.value,
                                            },
                                        })
                                    }}
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
                                    value={valuesState?.state?.password}
                                    onChange={(e) => {
                                        setValuesState({
                                            ...valuesState,
                                            state: {
                                                ...valuesState.state,
                                                password: e.target.value,
                                            },
                                        })
                                    }}
                                />
                                {formState?.errors?.password && (
                                    <p className="text-sm text-red-500">
                                        {formState?.errors.password.join(", ")}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        {visibleInfoMessage && formState?.message && (
                            <p
                                className={cn("text-sm text-primary", {
                                    "text-red-500":
                                        formState.typeMessage === "error",
                                })}
                            >
                                {formState.message}
                            </p>
                        )}
                        <Button
                            className="w-full"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? "Авторизация..." : "Авторизоваться"}
                        </Button>
                        <p className="text-center text-sm">
                            У вас нету аккаунта?
                            <Link
                                href="/auth/register"
                                className="text-blue-600 hover:underline"
                            >
                                <Button variant="link">
                                    Зарегистрироваться
                                </Button>
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default LoginPage
