"use server"

import bcrypt from "bcrypt"
import { AuthError } from "next-auth"
import { UTApi } from "uploadthing/server"

import { signIn } from "../../../auth"
import prisma from "../prisma"

import {
    FormRegisterType,
    FormLoginType,
    formLoginSchema,
    formRegisterSchema,
} from "./schemas"

export const registerAction = async (
    prefState: FormRegisterType | undefined,
    formData: FormData,
): Promise<FormRegisterType | undefined> => {
    console.log(formData)
    const validatedFields = formRegisterSchema.safeParse(
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

    const { email, password, name } = validatedFields.data
    const image = formData.get("image") as File | null

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return {
                errors: {
                    email: ["Пользователь с таким email уже существует"],
                },
                message: "Регистрация не удалась.",
                typeMessage: "error",
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        let imageUrl = ""
        if (image) {
            try {
                const imageResponse = await new UTApi().uploadFiles(image)
                imageUrl = imageResponse.data?.url || ""
            } catch (error) {
                console.error("Error uploading image:", error)
            }
        }

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                image: imageUrl,
            },
        })
        return {
            message: "Регистрация прошла успешно.",
            typeMessage: "success",
            redirectTo: "/auth/login",
        }
    } catch (error) {
        console.error(error)
        return {
            message: `Ошибка при регистрации: ${(error as Error).message}`,
            typeMessage: "error",
        }
    }
}

export const loginAction = async (
    prefState: FormLoginType | undefined,
    formData: FormData,
): Promise<FormRegisterType | undefined> => {
    const validatedFields = formLoginSchema.safeParse(
        Object.fromEntries(formData.entries()),
    )

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Исправьте ошибки в форме.",
            typeMessage: "error",
        }
    }

    try {
        await signIn("credentials", {
            email: validatedFields.data.email,
            password: validatedFields.data.password,
            redirect: false,
        })
        return {
            message: "Авторизации прошла успешно.",
            typeMessage: "success",
            redirectTo: "/",
        }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    console.log(error)
                    return {
                        message: "Неверный логин или пароль.",
                        typeMessage: "error",
                    }
                default:
                    return {
                        message: "Ошибка авторизации.",
                        typeMessage: "error",
                    }
            }
        }
        throw error
    }
}
