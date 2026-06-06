import OpenAI from "openai"

export const hasApiKey = !!process.env.OPENAI_API_KEY

let _client: OpenAI | null = null

export function getOpenAI(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return _client
}
