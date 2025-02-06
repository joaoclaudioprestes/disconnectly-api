import { UserRepository } from '@/interfaces/user-interface'
import { User } from '@prisma/client'
import { UserNotFoundError } from './error/user-not-found'
import bcrypt from 'bcryptjs'
import { InvalidPasswordError } from './error/invalid-password-error'

import jwt from 'jsonwebtoken'
import { env } from '@/env'

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async signIn(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findUser(email)

    if (!user) {
      throw new UserNotFoundError()
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      throw new InvalidPasswordError()
    }

    const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
      expiresIn: '1d',
    })

    const userWithToken = await this.userRepository.updateUser(user.id, {
      token,
    })

    return userWithToken
  }
}
