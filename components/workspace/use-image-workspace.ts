"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import {
  CONNECTION_STORAGE_KEY,
  COPY,
  MODEL_OPTIONS,
} from "./copy"
import type {
  FieldErrors,
  GeneratedImage,
  GenerationResponse,
  Locale,
  StoredConnection,
} from "./types"
import {
  getCountValue,
  getImageSrc,
  readError,
  usePrefersReducedMotion,
  validateForm,
} from "./utils"

export function useImageWorkspace() {
  const [locale, setLocale] = React.useState<Locale>("zh")
  const { theme, setTheme } = useTheme()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [baseUrl, setBaseUrl] = React.useState("https://api.openai.com")
  const [apiKey, setApiKey] = React.useState("")
  const [model, setModel] = React.useState(MODEL_OPTIONS[0]?.value ?? "gpt-image-2")
  const [rememberConnection, setRememberConnection] = React.useState(false)
  const [connectionLoaded, setConnectionLoaded] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [prompt, setPrompt] = React.useState("")
  const [referenceFile, setReferenceFile] = React.useState<File | null>(null)
  const [referencePreviewUrl, setReferencePreviewUrl] = React.useState("")
  const [size, setSize] = React.useState("1024x1024")
  const [quality, setQuality] = React.useState("auto")
  const [format, setFormat] = React.useState("png")
  const [countInput, setCountInput] = React.useState("1")
  const [transparent, setTransparent] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({})
  const [images, setImages] = React.useState<GeneratedImage[]>([])
  const baseUrlRef = React.useRef<HTMLInputElement>(null)
  const apiKeyRef = React.useRef<HTMLInputElement>(null)
  const promptRef = React.useRef<HTMLTextAreaElement>(null)
  const countRef = React.useRef<HTMLInputElement>(null)
  const referenceInputRef = React.useRef<HTMLInputElement>(null)

  const text = COPY[locale]
  const count = getCountValue(countInput)
  const isEditMode = Boolean(referenceFile)
  const isConfigured = /^https?:\/\/.+/i.test(baseUrl.trim()) && Boolean(apiKey.trim())

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(CONNECTION_STORAGE_KEY)

        if (!raw) {
          setConnectionLoaded(true)
          return
        }

        const parsed = JSON.parse(raw) as Partial<StoredConnection>

        if (parsed.remember) {
          setBaseUrl(
            typeof parsed.baseUrl === "string" ? parsed.baseUrl : "https://api.openai.com"
          )
          setApiKey(typeof parsed.apiKey === "string" ? parsed.apiKey : "")
          setModel(
            typeof parsed.model === "string"
              ? parsed.model
              : MODEL_OPTIONS[0]?.value ?? "gpt-image-2"
          )
          setRememberConnection(true)
        }
      } catch {
        window.localStorage.removeItem(CONNECTION_STORAGE_KEY)
      } finally {
        setConnectionLoaded(true)
      }
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  React.useEffect(() => {
    if (!connectionLoaded) {
      return
    }

    if (!rememberConnection) {
      window.localStorage.removeItem(CONNECTION_STORAGE_KEY)
      return
    }

    const payload: StoredConnection = {
      remember: true,
      baseUrl,
      apiKey,
      model,
    }

    window.localStorage.setItem(CONNECTION_STORAGE_KEY, JSON.stringify(payload))
  }, [apiKey, baseUrl, connectionLoaded, model, rememberConnection])

  React.useEffect(() => {
    return () => {
      if (referencePreviewUrl) {
        URL.revokeObjectURL(referencePreviewUrl)
      }
    }
  }, [referencePreviewUrl])

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current
      }

      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function focusFirstError(errors: FieldErrors) {
    if (errors.baseUrl) {
      setSettingsOpen(true)
      window.requestAnimationFrame(() => baseUrlRef.current?.focus())
      return
    }

    if (errors.apiKey) {
      setSettingsOpen(true)
      window.requestAnimationFrame(() => apiKeyRef.current?.focus())
      return
    }

    if (errors.prompt) {
      promptRef.current?.focus()
      return
    }

    if (errors.count) {
      countRef.current?.focus()
    }
  }

  async function readPayload(response: Response, fallback: string) {
    try {
      return (await response.json()) as GenerationResponse
    } catch {
      return { error: { message: fallback } }
    }
  }

  function submitGenerationRequest() {
    return fetch("/api/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base_url: baseUrl,
        api_key: apiKey,
        model,
        prompt,
        n: count,
        size,
        quality,
        output_format: format,
        background: transparent ? "transparent" : "auto",
      }),
    })
  }

  function submitEditRequest(file: File) {
    const body = new FormData()
    body.set("base_url", baseUrl)
    body.set("api_key", apiKey)
    body.set("model", model)
    body.set("prompt", prompt)
    body.set("n", String(count))
    body.set("size", size)
    body.set("quality", quality)
    body.set("output_format", format)
    body.set("background", transparent ? "transparent" : "auto")
    body.set("image", file, file.name || "reference-image")

    return fetch("/api/images/edits", {
      method: "POST",
      body,
    })
  }

  async function generateImage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errors = validateForm({ baseUrl, apiKey, prompt, count, locale })
    setFieldErrors(errors)
    setError("")

    if (Object.keys(errors).length > 0) {
      focusFirstError(errors)
      return
    }

    setIsLoading(true)

    try {
      const requestFailed = isEditMode ? text.editFailed : text.requestFailed
      const response = referenceFile
        ? await submitEditRequest(referenceFile)
        : await submitGenerationRequest()

      const payload = await readPayload(response, requestFailed)

      if (!response.ok) {
        throw new Error(readError(payload, requestFailed))
      }

      const nextImages =
        payload.data
          ?.map((item, index) => ({
            id: `${Date.now()}-${index}`,
            src: getImageSrc(item, format),
            revisedPrompt: item.revised_prompt,
          }))
          .filter((item) => item.src.length > 0) ?? []

      if (nextImages.length === 0) {
        throw new Error(text.noImage)
      }

      setImages(nextImages)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : text.requestFailed)
    } finally {
      setIsLoading(false)
    }
  }

  function onReferenceChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith("image/")) {
      setFieldErrors((current) => ({ ...current, reference: text.validateReference }))
      event.currentTarget.value = ""
      return
    }

    if (referencePreviewUrl) {
      URL.revokeObjectURL(referencePreviewUrl)
    }

    const previewUrl = URL.createObjectURL(file)
    setReferenceFile(file)
    setReferencePreviewUrl(previewUrl)
    clearFieldError("reference")
  }

  function removeReferenceImage() {
    if (referencePreviewUrl) {
      URL.revokeObjectURL(referencePreviewUrl)
    }

    setReferenceFile(null)
    setReferencePreviewUrl("")
    clearFieldError("reference")

    if (referenceInputRef.current) {
      referenceInputRef.current.value = ""
    }
  }

  return {
    locale,
    setLocale,
    theme,
    setTheme,
    prefersReducedMotion,
    baseUrl,
    setBaseUrl,
    apiKey,
    setApiKey,
    model,
    setModel,
    rememberConnection,
    setRememberConnection,
    settingsOpen,
    setSettingsOpen,
    prompt,
    setPrompt,
    referenceFile,
    referencePreviewUrl,
    size,
    setSize,
    quality,
    setQuality,
    format,
    setFormat,
    countInput,
    setCountInput,
    transparent,
    setTransparent,
    isLoading,
    error,
    fieldErrors,
    images,
    baseUrlRef,
    apiKeyRef,
    promptRef,
    countRef,
    referenceInputRef,
    text,
    count,
    isEditMode,
    isConfigured,
    clearFieldError,
    generateImage,
    onReferenceChange,
    removeReferenceImage,
  }
}

export type ImageWorkspaceValue = ReturnType<typeof useImageWorkspace>
