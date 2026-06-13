export const dynamic = "force-dynamic"
export const maxDuration = 300

import {
  SUPPORTED_BACKGROUNDS,
  SUPPORTED_FORMATS,
  SUPPORTED_MODELS,
  SUPPORTED_MODERATION,
  SUPPORTED_QUALITIES,
  SUPPORTED_SIZES,
  endpointFromBaseUrl,
  jsonError,
  pickAllowed,
  pickInteger,
  readUpstreamPayload,
  sanitizeOpenAIError,
  validateConnection,
  asString,
} from "../_shared"

type ImageGenerationRequest = {
  base_url?: unknown
  api_key?: unknown
  model?: unknown
  prompt?: unknown
  n?: unknown
  size?: unknown
  quality?: unknown
  output_format?: unknown
  background?: unknown
  moderation?: unknown
}

async function readJson(request: Request) {
  try {
    return (await request.json()) as ImageGenerationRequest
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  const body = await readJson(request)

  if (!body) {
    return jsonError("Request body must be valid JSON.")
  }

  const connection = validateConnection(body.base_url, body.api_key)
  const prompt = asString(body.prompt)

  if ("error" in connection) {
    return connection.error
  }

  if (!prompt) {
    return jsonError("Enter a prompt before generating an image.")
  }

  const model = pickAllowed(body.model, SUPPORTED_MODELS, "gpt-image-2")
  const n = pickInteger(body.n, 1)
  const size = pickAllowed(body.size, SUPPORTED_SIZES, "1024x1024")
  const quality = pickAllowed(body.quality, SUPPORTED_QUALITIES, "auto")
  const outputFormat = pickAllowed(body.output_format, SUPPORTED_FORMATS, "png")
  const background = pickAllowed(body.background, SUPPORTED_BACKGROUNDS, "auto")
  const moderation = pickAllowed(body.moderation, SUPPORTED_MODERATION, "auto")

  if (n < 1 || n > 4) {
    return jsonError("Image count must be between 1 and 4.")
  }

  const upstreamPayload = {
    model,
    prompt,
    n,
    size,
    quality,
    output_format: outputFormat,
    background,
    moderation,
  }

  try {
    const upstream = await fetch(endpointFromBaseUrl(connection.baseUrl, "generations"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${connection.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(upstreamPayload),
      cache: "no-store",
    })

    const payload = await readUpstreamPayload(upstream)

    if (!upstream.ok) {
      return jsonError(
        sanitizeOpenAIError(payload, "Image generation failed."),
        upstream.status
      )
    }

    return Response.json(payload, {
      headers: {
        "Cache-Control": "no-store",
      },
    })
  } catch {
    return jsonError(
      "Could not reach the configured base_url. Check the URL and network access.",
      502
    )
  }
}
