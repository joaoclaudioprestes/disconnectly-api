import { GeminiAIService } from '@/services/gemini-ai-service'

import { DisconnectService } from '../disconnect-service'

export function makeDisconnectService() {
  const geminiAIService = new GeminiAIService()

  const disconnectService = new DisconnectService(geminiAIService)

  return disconnectService
}
