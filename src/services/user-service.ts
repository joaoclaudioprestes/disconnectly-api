import { UserRepository } from '@/interfaces/user-interface'
import { Prisma, User } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import { UserAlreadyExists } from './error/user-already-exists-error'

export class UserService {
  constructor(private readonly userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const hasUser = await this.findUser(data.email)

    if (hasUser) {
      throw new UserAlreadyExists()
    }

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: await bcryptjs.hash(data.password, 8),
    })

    return user
  }

  async findUser(email: string): Promise<User | null> {
    const user = await this.userRepository.findUser(email)

    return user
  }
}
