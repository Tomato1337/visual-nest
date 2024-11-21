import { PrismaClient } from "@prisma/client"

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
    return new PrismaClient({
        log: ["query", "error", "warn"],
    })
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma
}

export default prisma
