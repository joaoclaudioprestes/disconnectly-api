import { prisma } from '@/database/prisma-client'
import { UserRepository } from '@/interfaces/user-interface'
import { Prisma, User } from '@prisma/client'

export class UserRepositoryPrisma implements UserRepository {
  async findUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
    })

    return user
  }

  async findUser(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
