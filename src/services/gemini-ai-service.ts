import { env } from '@/env'
import { GoogleGenAI } from '@google/genai'

const GEMINI_API_KEY = env.GEMINI_API_KEY

export class GeminiAIService {
  private ai: GoogleGenAI

  constructor() {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables')
    }

    this.ai = new GoogleGenAI({
      vertexai: false,
      apiKey: GEMINI_API_KEY,
    })
  }

  async generateContent(
    prompt: string = 'Explique como funciona a desconexão entre humanos e máquinas.',
  ): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      })

      return response.text || ''
    } catch (error) {
      console.error('Error generating content with Gemini:', error)
      throw error
    }
  }
}
