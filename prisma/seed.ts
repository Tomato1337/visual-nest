import { faker } from "@faker-js/faker"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
    // Удаление существующих данных (опционально)
    //   await prisma.board.deleteMany()
    //   await prisma.user.deleteMany()

    // Генерация пользователей
    const users = await Promise.all(
        Array.from({ length: 10 }).map(async () => {
            const hashedPassword = await bcrypt.hash(
                faker.internet.password(),
                10,
            )
            return prisma.user.create({
                data: {
                    email: faker.internet.email(),
                    name: faker.name.fullName(),
                    password: hashedPassword,
                    image: faker.image.avatar(), // URL аватарки
                },
            })
        }),
    )

    console.log(`Сгенерировано ${users.length} пользователей`)

    // Генерация досок для каждого пользователя
    for (const user of users) {
        await Promise.all(
            Array.from({ length: 5 }).map(() => {
                return prisma.board.create({
                    data: {
                        title: faker.lorem.words(3),
                        description: faker.lorem.sentence(),
                        image: faker.image.url(), // URL изображения доски
                        userId: user.id,
                    },
                })
            }),
        )
    }

    console.log(`Сгенерировано 50 досок`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
