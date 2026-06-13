export const dynamic = "force-dynamic"

import {
  SUPPORTED_BACKGROUNDS,
  SUPPORTED_FORMATS,
  SUPPORTED_MODELS,
  SUPPORTED_QUALITIES,
  SUPPORTED_SIZES,
  asString,
  endpointFromBaseUrl,
  jsonError,
  pickAllowed,
  pickInteger,
  readUpstreamPayload,
  sanitizeOpenAIError,
  validateConnection,
} from "../_shared"

async function readFormData(request: Request) {
  try {
    return await request.formData()
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  const formData = await readFormData(request)

  if (!formData) {
    return jsonError("Request body must be valid multipart/form-data.")
  }

  const connection = validateConnection(formData.get("base_url"), formData.get("api_key"))
  const prompt = asString(formData.get("prompt"))
  const image = formData.get("image")

  if ("error" in connection) {
    return connection.error
  }

  if (!prompt) {
    return jsonError("Enter a prompt before editing an image.")
  }

  if (!(image instanceof File) || image.size === 0) {
    return jsonError("Upload a reference image before using image edits.")
  }

  if (!image.type.startsWith("image/")) {
    return jsonError("Reference image must be an image file.")
  }

  const model = pickAllowed(formData.get("model"), SUPPORTED_MODELS, "gpt-image-2")
  const n = pickInteger(formData.get("n"), 1)
  const size = pickAllowed(formData.get("size"), SUPPORTED_SIZES, "1024x1024")
  const quality = pickAllowed(formData.get("quality"), SUPPORTED_QUALITIES, "auto")
  const outputFormat = pickAllowed(formData.get("output_format"), SUPPORTED_FORMATS, "png")
  const background = pickAllowed(formData.get("background"), SUPPORTED_BACKGROUNDS, "auto")

  if (n < 1 || n > 4) {
    return jsonError("Image count must be between 1 and 4.")
  }

  const upstreamForm = new FormData()
  upstreamForm.set("image", image, image.name || "reference-image")
  upstreamForm.set("model", model)
  upstreamForm.set("prompt", prompt)
  upstreamForm.set("n", String(n))
  upstreamForm.set("size", size)
  upstreamForm.set("quality", quality)
  upstreamForm.set("output_format", outputFormat)
  upstreamForm.set("background", background)

  try {
    const upstream = await fetch(endpointFromBaseUrl(connection.baseUrl, "edits"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${connection.apiKey}`,
      },
      body: upstreamForm,
      cache: "no-store",
    })

    const payload = await readUpstreamPayload(upstream)

    if (!upstream.ok) {
      return jsonError(sanitizeOpenAIError(payload, "Image edit failed."), upstream.status)
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
