"use server"

import { isRedirectError } from "next/dist/client/components/redirect"
import { redirect } from "next/navigation"
import { UTApi } from "uploadthing/server"

import { auth } from "../../../auth"
import prisma from "../prisma"

import { formImageCreateSchema, FormImageCreateType } from "./schemas"

export const imageCreateAction = async (
    prefState: FormImageCreateType | undefined,
    formData: FormData,
): Promise<FormImageCreateType | undefined> => {
    console.log(formData)
    const validatedFields = formImageCreateSchema.safeParse(
        Object.fromEntries(formData.entries()),
    )

    console.log(validatedFields)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Исправьте ошибки в форме.",
            typeMessage: "error",
        }
    }

    const session = await auth()
    if (!session?.user?.email) {
        return {
            message: "Ошибка авторизации",
            typeMessage: "error",
        }
    }

    const { description, title } = validatedFields.data
    const image = formData.get("image") as File | null

    if (image?.name === "undefined" || !image) {
        return {
            errors: {
                image: ["Необходимо загрузить изображение"],
            },
            message: "Исправьте ошибки в форме.",
            typeMessage: "error",
        }
    }

    try {
        const imageResponse = await new UTApi().uploadFiles(image)

        if (!imageResponse.data?.url) {
            return {
                message: "Ошибка при загрузке изображения",
                typeMessage: "error",
            }
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return {
                message: "Пользователь не найден",
                typeMessage: "error",
            }
        }

        await prisma.board.create({
            data: {
                title,
                description,
                image: imageResponse.data.url,
                userId: user?.id,
            },
        })

        redirect("/")

        // return {
        //     message: "Изображение успешно создано",
        //     typeMessage: "success",
        //     redirectTo: "/",
        // }
    } catch (error) {
        console.error(error)
        if (isRedirectError(error)) {
            throw error
        }
        return {
            message: `Ошибка при создании изображения: ${
                (error as Error).message
            }`,
            typeMessage: "error",
        }
    }
}
