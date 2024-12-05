import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    // ! Небезопасно, но позволяет загружать изображения с любых хостов
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**", // Разрешить все хосты
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "6mb",
        },
    },
}

export default nextConfig
