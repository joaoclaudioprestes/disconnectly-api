import { UserRepository } from '@/interfaces/user-interface'
import { User } from '@prisma/client'
import { UserNotFoundError } from './error/user-not-found'
import bcrypt from 'bcryptjs'
import { InvalidPasswordError } from './error/invalid-password-error'

import jwt from 'jsonwebtoken'
import { env } from '@/env'
import { SmtpService } from './smtp-service'
import { InvalidTokenError } from './error/invalid-token-error'

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private smtp: SmtpService,
  ) {
    this.userRepository = userRepository
    this.smtp = new SmtpService()
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

  async recoverPassword(email: string): Promise<void> {
    const user = await this.userRepository.findUser(email)

    if (!user) {
      throw new UserNotFoundError()
    }

    // Create a new token and magic link
    const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
      expiresIn: '1h',
    })

    const magicLink = `http://${env.HOST}:${env.PORT}/reset-password?token=${token}`

    // Send magic link to user email
    this.smtp.sendEmail({
      to: email,
      subject: 'Password Recovery',
      text: `Click the link to reset your password: ${magicLink}`,
    })

    // Update user with new token
    await this.userRepository.updateUser(user.id, {
      passwordResetToken: token,
    })
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const userId = jwt.decode(token, { json: true })?.id

    const user = await this.userRepository.findUserById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const getToken = user.passwordResetToken

    if (!getToken) {
      throw new InvalidTokenError()
    }

    const payload = jwt.verify(getToken, env.JWT_SECRET)

    if (typeof payload === 'string') {
      throw new InvalidTokenError()
    }

    await this.userRepository.updateUser(user.id, {
      password: await bcrypt.hash(password, 10),
      passwordResetToken: null,
    })

    this.smtp.sendEmail({
      to: user.email,
      subject: 'Password Updated',
      text: 'Your password has been updated! If you did not request this change, please contact us.',
    })
  }
}
