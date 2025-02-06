import { User, Prisma } from '@prisma/client'

export interface IUserForUpdate extends Partial<User> {
  token: string
}

export interface UserRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findUser(email: string): Promise<User | null>
  updateUser(id: string, data: IUserForUpdate): Promise<User>
}
