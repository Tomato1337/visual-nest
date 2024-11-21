import bcrypt from "bcrypt"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

import prisma from "@/lib/prisma"

import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(6),
                    })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data
                    const user = await prisma.user.findUnique({
                        where: {
                            email,
                        },
                    })
                    if (!user) return null
                    // console.log(password, user.password)
                    const passwordsMatch = await bcrypt.compare(
                        password,
                        user.password,
                    )

                    // console.log(passwordsMatch, password, user.password)

                    if (passwordsMatch) return user
                }

                return null
            },
        }),
    ],
})
