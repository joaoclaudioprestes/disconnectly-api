import { UserRepository } from '@/interfaces/user-interface'
import { Prisma, User } from '@prisma/client'
import bcryptjs from 'bcryptjs'

export class UserService {
  constructor(private readonly userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      const user = await this.userRepository.create({
        name: data.name,
        email: data.email,
        password: await bcryptjs.hash(data.password, 8),
      })

      return user
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`)
    }
  }
}
