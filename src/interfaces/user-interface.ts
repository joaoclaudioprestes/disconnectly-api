import { User, Prisma } from '@prisma/client'

export interface UserRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findUser(email: string): Promise<User | null>
  findUserById(id: string): Promise<User | null>
  updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User>
}
