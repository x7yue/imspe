import type { GenerationResponse } from "./types"

export type ImageOperation = "generations" | "edits"

export function normalizeBaseUrl(value: string) {
  const raw = value.trim().replace(/\/+$/, "")

  if (!raw) {
    return ""
  }

  try {
    const url = new URL(raw)

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return ""
    }

    return url.toString().replace(/\/+$/, "")
  } catch {
    return ""
  }
}

export function endpointFromBaseUrl(baseUrl: string, operation: ImageOperation) {
  const operationSuffix = `/images/${operation}`
  const otherSuffix = operation === "generations" ? "/images/edits" : "/images/generations"

  if (baseUrl.endsWith(operationSuffix)) {
    return baseUrl
  }

  if (baseUrl.endsWith(otherSuffix)) {
    return `${baseUrl.slice(0, -otherSuffix.length)}${operationSuffix}`
  }

  if (baseUrl.endsWith("/v1")) {
    return `${baseUrl}${operationSuffix}`
  }

  return `${baseUrl}/v1${operationSuffix}`
}

async function parseUpstream(response: Response): Promise<GenerationResponse> {
  const contentType = response.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    try {
      return (await response.json()) as GenerationResponse
    } catch {
      return {}
    }
  }

  const text = await response.text().catch(() => "")
  return text ? { error: { message: text } } : {}
}

export type GenerationParams = {
  baseUrl: string
  apiKey: string
  model: string
  prompt: string
  n: number
  size: string
  quality: string
  outputFormat: string
  background: string
}

export type EditParams = GenerationParams & {
  image: File
}

export async function requestGeneration(params: GenerationParams) {
  const endpoint = endpointFromBaseUrl(normalizeBaseUrl(params.baseUrl), "generations")

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: params.model,
      prompt: params.prompt,
      n: params.n,
      size: params.size,
      quality: params.quality,
      output_format: params.outputFormat,
      background: params.background,
      moderation: "auto",
    }),
  })

  return { ok: response.ok, payload: await parseUpstream(response) }
}

export async function requestEdit(params: EditParams) {
  const endpoint = endpointFromBaseUrl(normalizeBaseUrl(params.baseUrl), "edits")

  const body = new FormData()
  body.set("image", params.image, params.image.name || "reference-image")
  body.set("model", params.model)
  body.set("prompt", params.prompt)
  body.set("n", String(params.n))
  body.set("size", params.size)
  body.set("quality", params.quality)
  body.set("output_format", params.outputFormat)
  body.set("background", params.background)

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
    },
    body,
  })

  return { ok: response.ok, payload: await parseUpstream(response) }
}
