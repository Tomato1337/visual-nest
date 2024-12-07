import { Board, User } from "@prisma/client"

export type BoardWithUser = Board & { user: User }
