import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { ViewTransitions } from "next-view-transitions"
import "./globals.css"
import { Inter } from "next/font/google"

export const metadata: Metadata = {
    title: "VisualNest",
    description: "Приложения-галерея для просмотра изображений",
}

const interFont = Inter({
    subsets: ["latin", "cyrillic"],
    variable: "--inter",
})

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ViewTransitions>
            <html lang="en">
                <body className={`${interFont.variable} antialiased`}>
                    {children}
                    <Analytics />
                    <SpeedInsights />
                </body>
            </html>
        </ViewTransitions>
    )
}
