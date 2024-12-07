import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "15", 10)

    const images = await prisma.board.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: true },
    })

    const totalCount = await prisma.board.count()

    return NextResponse.json({
        images,
        totalCount,
        hasMore: page * limit < totalCount,
    })
}
