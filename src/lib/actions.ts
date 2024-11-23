"use server"

import bcrypt from "bcrypt"
import { isRedirectError } from "next/dist/client/components/redirect"
import { redirect } from "next/navigation"
import { AuthError } from "next-auth"
import { z } from "zod"

import { signIn } from "../../auth"

import prisma from "./prisma"

export type State<T> = {
    state?: {
        [K in keyof T]?: T[K]
    }
    errors?: {
        [K in keyof T]?: T[K][]
    }
    message?: string | null
    typeMessage?: "error" | "success"
}

const formAuthSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
})

const formLoginSchema = formAuthSchema.omit({ name: true })
const formRegisterSchema = formAuthSchema

export type FormRegisterType = State<z.infer<typeof formRegisterSchema>>
export type FormLoginType = State<z.infer<typeof formLoginSchema>>

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

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        })

        redirect("/auth/login")
    } catch (error) {
        console.error(error)
        if (isRedirectError(error)) {
            throw error
        }
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
        redirect("/")
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

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
