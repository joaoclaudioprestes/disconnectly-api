import { UserRepositoryPrisma } from '@/repositories/user-repository'
import { AuthService } from '../auth-service'

export function makeAuthService() {
  const userRepository = new UserRepositoryPrisma()
  const authService = new AuthService(userRepository)

  return authService
}
