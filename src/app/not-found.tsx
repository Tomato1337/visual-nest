import { FrownIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

const NotFoundPage = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
            <FrownIcon className="mb-4" size={128} />
            <h1 className="mb-1 text-4xl font-bold">404</h1>
            <p className="mb-4 text-xl">Страница не найдена</p>
            <Link href="/" passHref>
                <Button variant="default" size="lg">
                    Вернуться на главную
                </Button>
            </Link>
        </div>
    )
}

export default NotFoundPage
