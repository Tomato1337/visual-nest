"use client"

import { useRouter } from "next/navigation"
import React, { useState, useActionState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { imageCreateAction } from "@/lib/actions/create-image-actions"
import { FormImageCreateType } from "@/lib/actions/schemas"
import { cn } from "@/lib/utils"

import DragAndDrop, { ImageData } from "./ui/drag-and-drop"

interface ImageUploadPopupProps {
    children: React.ReactNode
}

export function CreateBoard({ children }: ImageUploadPopupProps) {
    const router = useRouter()

    const [isOpen, setIsOpen] = useState(false)
    const [imageData, setImageData] = useState<ImageData>({
        file: null,
        image: null,
    })

    const [valuesState, setValuesState] = useState<FormImageCreateType>({
        state: {
            title: "",
            description: "",
            image: undefined,
        },
        errors: {},
        message: null,
    })
    const [formState, formAction, isPending] = useActionState(
        imageCreateAction,
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

    useEffect(() => {
        if (formState?.typeMessage === "success") {
            setIsOpen(false)
            setValuesState({
                state: {
                    title: "",
                    description: "",
                    image: undefined,
                },
                errors: {},
                message: null,
            })
            setImageData({
                file: null,
                image: null,
            })
            // router.push("/")
            // router.refresh()
            // revalidatePath("/")
        }
    }, [formState, router])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="rounded-2xl sm:max-w-[825px]">
                <DialogHeader>
                    <DialogTitle>Создание нового изображения</DialogTitle>
                </DialogHeader>
                <form
                    action={formAction}
                    className="flex flex-col gap-8 sm:flex-row"
                >
                    <div className="flex basis-10/12 flex-col gap-2">
                        <DragAndDrop
                            imageData={imageData}
                            setImageData={setImageData}
                        />
                        {formState?.errors?.image && (
                            <p className="text-sm text-red-500">
                                {formState?.errors.image.join(", ")}
                            </p>
                        )}
                    </div>
                    <div className="w-full space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Заголовок</Label>
                            <Input
                                id="title"
                                name="title"
                                value={valuesState?.state?.title}
                                onChange={(e) =>
                                    setValuesState((prev) => ({
                                        ...prev,
                                        state: {
                                            ...prev.state,
                                            title: e.target.value,
                                        },
                                    }))
                                }
                                placeholder="Введите заголовок изображения"
                                required
                            />
                            {formState?.errors?.title && (
                                <p className="text-sm text-red-500">
                                    {formState?.errors.title.join(", ")}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Описание</Label>
                            <Textarea
                                id="description"
                                name="description"
                                className="h-full"
                                value={valuesState?.state?.description}
                                onChange={(e) =>
                                    setValuesState((prev) => ({
                                        ...prev,
                                        state: {
                                            ...prev.state,
                                            description: e.target.value,
                                        },
                                    }))
                                }
                                placeholder="Введите описание изображения"
                            />
                            {formState?.errors?.description && (
                                <p className="text-sm text-red-500">
                                    {formState?.errors.description.join(", ")}
                                </p>
                            )}
                        </div>

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

                        <div className="flex justify-end">
                            <Button disabled={isPending} type="submit">
                                {isPending ? "Создание..." : "Создать"}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
