"use client"

import { Link } from "next-view-transitions"
import { useTransitionRouter } from "next-view-transitions"
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
import DragAndDrop, { ImageData } from "@/components/ui/drag-and-drop"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerAction } from "@/lib/actions/auth-actions"
import { FormRegisterType } from "@/lib/actions/schemas"
import { cn } from "@/lib/utils"

const RegisterPage = () => {
    const router = useTransitionRouter()

    const [imageState, setImageState] = useState<ImageData>({
        file: null,
        image: null,
    })

    const valuesState: FormRegisterType = {
        errors: {},
        message: null,
        typeMessage: undefined,
    }

    const [formState, formAction, isPending] = useActionState(
        registerAction,
        valuesState,
    )
    const [visibleInfoMessage, setVisibleInfoMessage] = useState(false)

    useEffect(() => {
        if (formState?.message) {
            setVisibleInfoMessage(true)
            const timer = setTimeout(() => {
                setVisibleInfoMessage(false)
            }, 5000)

            // из-за безопасности очищаем картинку, т.к браузер не даёт установить defaultValue для input[type="file"]
            setImageState({
                file: null,
                image: null,
            })

            return () => clearTimeout(timer)
        }
    }, [formState])

    useEffect(() => {
        if (formState?.typeMessage === "success") {
            router.push(formState.redirectTo || "/auth/login")
        }
    }, [formState, router])

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Регистрация</CardTitle>
                <CardDescription>
                    Введите свои учетные данные для создания новой учетной.
                </CardDescription>
            </CardHeader>
            <form action={formAction}>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Имя</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                defaultValue={formState?.payload?.name}
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
                                defaultValue={formState?.payload?.email}
                                required
                            />
                            {formState?.errors?.email && (
                                <p className="text-sm text-red-500">
                                    {formState?.errors.email.join(", ")}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Аватар</Label>
                            <DragAndDrop
                                imageData={imageState}
                                setImageData={setImageState}
                            />
                            {formState?.errors?.image && (
                                <p className="text-sm text-red-500">
                                    {formState?.errors.image.join(", ")}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Пароль</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                defaultValue={formState?.payload?.password}
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
                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        className="w-full"
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? "Регистрация..." : "Зарегистрироваться"}
                    </Button>
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
                    <p className="text-center text-sm">
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
    )
}

export default RegisterPage
