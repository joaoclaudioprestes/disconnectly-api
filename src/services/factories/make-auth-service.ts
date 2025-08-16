import { UserRepositoryPrisma } from '@/repositories/user-repository'

import { AuthService } from '../auth-service'
import { SmtpService } from '../smtp-service'

export function makeAuthService() {
  const userRepository = new UserRepositoryPrisma()
  const smtpService = new SmtpService()
  const authService = new AuthService(userRepository, smtpService)

  return authService
}
