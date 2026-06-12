import * as React from "react"

import { COPY } from "./copy"
import type { FieldErrors, GenerationResponse, Locale } from "./types"

export function getMimeType(format: string) {
  if (format === "jpeg") {
    return "image/jpeg"
  }

  if (format === "webp") {
    return "image/webp"
  }

  return "image/png"
}

export function getImageSrc(
  item: NonNullable<GenerationResponse["data"]>[number],
  format: string
) {
  if (item.b64_json) {
    return `data:${getMimeType(format)};base64,${item.b64_json}`
  }

  return item.url ?? ""
}

export function readError(payload: GenerationResponse, fallback: string) {
  return payload.error?.message || fallback
}

export function getSecretPreview(apiKey: string, locale: Locale) {
  const text = COPY[locale]

  if (!apiKey) {
    return text.secretUnset
  }

  if (apiKey.length <= 10) {
    return text.secretSaved
  }

  return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`
}

export function getCountValue(value: string) {
  const parsed = Number(value)
  return Number.isInteger(parsed) ? parsed : Number.NaN
}

export function validateForm({
  baseUrl,
  apiKey,
  prompt,
  count,
  locale,
}: {
  baseUrl: string
  apiKey: string
  prompt: string
  count: number
  locale: Locale
}) {
  const text = COPY[locale]
  const nextErrors: FieldErrors = {}
  const normalizedBaseUrl = baseUrl.trim()

  if (!/^https?:\/\/.+/i.test(normalizedBaseUrl)) {
    nextErrors.baseUrl = text.validateBaseUrl
  }

  if (!apiKey.trim()) {
    nextErrors.apiKey = text.validateApiKey
  }

  if (!prompt.trim()) {
    nextErrors.prompt = text.validatePrompt
  }

  if (!Number.isInteger(count) || count < 1 || count > 4) {
    nextErrors.count = text.validateCount
  }

  return nextErrors
}

export function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => {}
      }

      const query = window.matchMedia("(prefers-reduced-motion: reduce)")
      query.addEventListener("change", onStoreChange)

      return () => query.removeEventListener("change", onStoreChange)
    },
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  )
}
