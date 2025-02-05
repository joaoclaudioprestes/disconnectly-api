import { UserService } from '../user-service'
import { UserRepositoryPrisma } from '@/repositories/user-repository'

export function makeUserService() {
  const userRepository = new UserRepositoryPrisma()
  const userService = new UserService(userRepository)

  return userService
}
