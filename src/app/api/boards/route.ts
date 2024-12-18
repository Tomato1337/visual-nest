import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    const searchParams = new URL(request.url).searchParams

    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "15", 10)
    const search = searchParams.get("search") || ""

    console.log("--------------", searchParams)

    const images = await prisma.board.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        where: {
            OR: [
                { title: { contains: search, mode: "insensitive" } },
                { user: { name: { contains: search, mode: "insensitive" } } },
            ],
        },
        include: { user: true },
    })

    const totalCount = await prisma.board.count()

    return NextResponse.json({
        images,
        totalCount,
        hasMore: page * limit < totalCount,
    })
}
