import type { Metadata } from "next"
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
        <html lang="en">
            <body className={`${interFont.variable} antialiased`}>
                {children}
            </body>
        </html>
    )
}
