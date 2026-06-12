export type Locale = "zh" | "en"
export type ThemeChoice = "light" | "dark" | "system"

export type GeneratedImage = {
  id: string
  src: string
  revisedPrompt?: string
}

export type GenerationResponse = {
  data?: Array<{
    b64_json?: string
    url?: string
    revised_prompt?: string
  }>
  error?: {
    message?: string
  }
}

export type FieldErrors = Partial<
  Record<"baseUrl" | "apiKey" | "prompt" | "count" | "reference", string>
>

export type StoredConnection = {
  remember: true
  baseUrl: string
  apiKey: string
  model: string
}
