export type ImageOperation = "generations" | "edits"

export const SUPPORTED_MODELS = new Set(["gpt-image-2"])
export const SUPPORTED_SIZES = new Set(["1024x1024", "1024x1536", "1536x1024", "auto"])
export const SUPPORTED_QUALITIES = new Set(["auto", "low", "medium", "high"])
export const SUPPORTED_FORMATS = new Set(["png", "jpeg", "webp"])
export const SUPPORTED_BACKGROUNDS = new Set(["auto", "transparent", "opaque"])
export const SUPPORTED_MODERATION = new Set(["auto", "low"])

export function jsonError(message: string, status = 400) {
  return Response.json({ error: { message } }, { status })
}

export function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

export function normalizeBaseUrl(value: unknown) {
  const raw = asString(value).replace(/\/+$/, "")

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

export function isBlockedBaseUrlHost(hostname: string) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "")

  if (host === "localhost" || host.endsWith(".localhost")) {
    return true
  }

  if (host === "::" || host === "::1" || host.startsWith("fe80:") || host.startsWith("fc")) {
    return true
  }

  const parts = host.split(".").map((part) => Number(part))
  const isIPv4 =
    parts.length === 4 &&
    parts.every((part) => Number.isInteger(part) && part >= 0 && part <= 255)

  if (!isIPv4) {
    return false
  }

  const [first, second] = parts

  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    first >= 224 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168) ||
    (first === 198 && (second === 18 || second === 19))
  )
}

export function validateConnection(baseUrlValue: unknown, apiKeyValue: unknown) {
  const baseUrl = normalizeBaseUrl(baseUrlValue)
  const apiKey = asString(apiKeyValue)

  if (!baseUrl) {
    return {
      error: jsonError("Enter a valid base_url that starts with http:// or https://."),
    }
  }

  if (isBlockedBaseUrlHost(new URL(baseUrl).hostname)) {
    return {
      error: jsonError("base_url must point to a public OpenAI-compatible endpoint."),
    }
  }

  if (!apiKey) {
    return {
      error: jsonError("Enter an API key."),
    }
  }

  return { baseUrl, apiKey }
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

export function pickAllowed(value: unknown, allowed: Set<string>, fallback: string) {
  const text = asString(value)
  return allowed.has(text) ? text : fallback
}

export function pickInteger(value: unknown, fallback: number) {
  const parsed = typeof value === "number" ? value : Number(asString(value))
  return Number.isInteger(parsed) ? parsed : fallback
}

export function sanitizeOpenAIError(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") {
    return fallback
  }

  const maybeError = "error" in payload ? payload.error : undefined

  if (!maybeError || typeof maybeError !== "object") {
    return fallback
  }

  const message =
    "message" in maybeError && typeof maybeError.message === "string"
      ? maybeError.message
      : fallback

  return message
}

export async function readUpstreamPayload(upstream: Response) {
  const contentType = upstream.headers.get("content-type") ?? ""

  return contentType.includes("application/json")
    ? await upstream.json()
    : { error: { message: await upstream.text() } }
}

const KEEPALIVE_INTERVAL_MS = 15000

// Image generation can take well over a minute. A plain proxied fetch keeps the
// HTTP response header pending until the upstream finishes, which trips
// Cloudflare's ~100s origin timeout (error 524) and any intermediate proxy
// read timeout. To avoid that we flush the response head immediately and emit
// whitespace heartbeats until the upstream resolves, then append the real JSON
// body. JSON.parse ignores leading whitespace, so clients still call
// response.json() unchanged. Errors are carried in the body as { error } since
// the status line is already committed to 200 once streaming begins.
export function streamJsonWithKeepalive(produce: () => Promise<unknown>) {
  const encoder = new TextEncoder()
  let timer: ReturnType<typeof setInterval> | null = null
  let settled = false

  const stream = new ReadableStream({
    async start(controller) {
      // Flush headers + first byte right away so Cloudflare/nginx see a live
      // response far ahead of their first-byte timeouts.
      controller.enqueue(encoder.encode(" "))

      timer = setInterval(() => {
        if (settled) {
          return
        }

        try {
          controller.enqueue(encoder.encode(" "))
        } catch {
          // Stream already closed; nothing to keep alive.
        }
      }, KEEPALIVE_INTERVAL_MS)

      let payload: unknown

      try {
        payload = await produce()
      } catch {
        payload = { error: { message: "Image request failed unexpectedly." } }
      }

      settled = true

      if (timer) {
        clearInterval(timer)
      }

      try {
        controller.enqueue(encoder.encode(`\n${JSON.stringify(payload)}`))
      } catch {
        // Client disconnected before completion.
      }

      controller.close()
    },
    cancel() {
      settled = true

      if (timer) {
        clearInterval(timer)
      }
    },
  })

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      // Disable nginx response buffering so heartbeats pass through immediately.
      "X-Accel-Buffering": "no",
    },
  })
}
