import { z } from "zod"

export type State<T> = {
    state?: {
        [K in keyof T]?: T[K]
    }
    errors?: {
        [K in keyof T]?: string[]
    }
    message?: string | null
    typeMessage?: "error" | "success"
    redirectTo?: string
    payload?: T
}

const formAuthSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    image: z
        .instanceof(File)
        .refine(
            (file) =>
                !file || (file instanceof File && file.size <= 5 * 1024 * 1024),
            "Размер файла должен быть меньше 5MB",
        )
        .optional(),
})

export const formImageCreateSchema = z.object({
    title: z.string(),
    description: z.string(),
    image: z
        .instanceof(File)
        .refine(
            (file) =>
                !file || (file instanceof File && file.size <= 5 * 1024 * 1024),
            "Размер файла должен быть меньше 5MB",
        ),
})

export type FormRegisterType = State<z.infer<typeof formRegisterSchema>>
export type FormLoginType = State<z.infer<typeof formLoginSchema>>

export type FormImageCreateType = State<z.infer<typeof formImageCreateSchema>>

export const formLoginSchema = formAuthSchema.omit({ name: true, image: true })
export const formRegisterSchema = formAuthSchema
