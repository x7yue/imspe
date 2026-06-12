"use client"

import * as React from "react"
import {
  ChevronDown,
  ImageIcon,
  ImagePlus,
  Loader2,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { FORMAT_OPTIONS, QUALITY_OPTIONS, SIZE_OPTIONS } from "./copy"
import { ImageResult } from "./image-result"
import { StatusPill } from "./status-pill"
import { useWorkspace } from "./workspace-context"

function CanvasBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,135,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,135,0.07)_1px,transparent_1px)] bg-[size:32px_32px]" />
    </div>
  )
}

export function PreviewCanvas() {
  const { text, isLoading, isEditMode, images, model, countInput, size, quality, format, transparent, locale, rememberConnection } =
    useWorkspace()

  const selectedSize = SIZE_OPTIONS.find((option) => option.value === size)
  const selectedQuality = QUALITY_OPTIONS.find((option) => option.value === quality)
  const selectedFormat = FORMAT_OPTIONS.find((option) => option.value === format)

  return (
    <aside className="grid min-h-[480px] grid-rows-[auto_minmax(320px,1fr)_auto] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-lg xl:h-full xl:min-h-0">
      <div className="flex min-w-0 flex-col gap-3 border-b border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{text.preview}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{text.previewHint}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone={isEditMode ? "amber" : "cyan"}>
            {isEditMode ? (
              <ImagePlus className="size-3.5" strokeWidth={1.8} aria-hidden />
            ) : (
              <Sparkles className="size-3.5" strokeWidth={1.8} aria-hidden />
            )}
            <span>{isEditMode ? text.modeEdit : text.modeGenerate}</span>
          </StatusPill>
          <StatusPill tone="cyan">
            <ImageIcon className="size-3.5" strokeWidth={1.8} aria-hidden />
            <span>{selectedSize?.detail ?? size}</span>
          </StatusPill>
          <StatusPill tone="cyan">
            <ChevronDown className="size-3.5" strokeWidth={1.8} aria-hidden />
            <span>{selectedFormat?.label ?? format.toUpperCase()}</span>
          </StatusPill>
        </div>
      </div>

      <div className="relative min-h-[320px] overflow-hidden xl:min-h-0">
        <CanvasBackdrop />
        {isLoading ? (
          <div className="relative z-10 grid h-full min-h-[320px] content-center gap-6 p-6 xl:min-h-0">
            <div className="mx-auto grid size-16 place-items-center rounded-xl bg-cyan-500 text-white shadow-lg dark:bg-cyan-400 dark:text-slate-950">
              <Loader2 className="size-7 animate-spin motion-reduce:animate-none" strokeWidth={1.8} aria-hidden />
            </div>
            <div className="mx-auto max-w-md text-center">
              <p className="text-lg font-semibold">{text.loadingTitle}</p>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {isEditMode ? text.loadingEdit : text.loadingGenerate}
              </p>
            </div>
            <div className="mx-auto grid w-full max-w-md gap-2.5" aria-hidden>
              <div className="h-2 animate-pulse rounded-full bg-cyan-500/30 motion-reduce:animate-none" />
              <div className="h-2 w-4/5 animate-pulse rounded-full bg-muted-foreground/20 motion-reduce:animate-none" />
              <div className="h-2 w-2/3 animate-pulse rounded-full bg-muted-foreground/10 motion-reduce:animate-none" />
            </div>
          </div>
        ) : images.length > 0 ? (
          <div
            className={cn(
              "relative z-10 grid gap-3 p-3",
              images.length === 1 ? "min-h-[320px] grid-cols-1 xl:min-h-0" : "grid-cols-1 md:grid-cols-2"
            )}
          >
            {images.map((image, index) => (
              <ImageResult
                key={image.id}
                image={image}
                index={index}
                format={format}
                resultMetaLabel={text.resultMeta}
                revisedPromptLabel={text.revisedPrompt}
                generatedOutputLabel={text.generatedOutput}
                downloadLabel={text.download}
              />
            ))}
          </div>
        ) : (
          <div className="relative z-10 grid h-full min-h-[320px] content-center gap-5 p-6 xl:min-h-0">
            <div className="mx-auto grid size-20 place-items-center rounded-xl border border-border bg-muted/50 text-cyan-600 dark:text-cyan-300">
              {isEditMode ? (
                <ImagePlus className="size-9" strokeWidth={1.6} aria-hidden />
              ) : (
                <ImageIcon className="size-9" strokeWidth={1.6} aria-hidden />
              )}
            </div>
            <div className="mx-auto max-w-md text-center">
              <p className="text-xl font-semibold">{text.emptyTitle}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text.emptyBody}</p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border bg-muted/40 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <div className="min-w-0">
            <p className="text-sm font-semibold">{text.requestSummary}</p>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              {rememberConnection ? text.privacyMemory : text.privacySession}
            </p>
          </div>
          <div className="flex min-w-0 flex-wrap gap-2 font-mono text-[0.68rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            <span className="rounded-full border border-border px-2.5 py-1">{model}</span>
            <span className="rounded-full border border-border px-2.5 py-1">{countInput || "1"}x</span>
            <span className="rounded-full border border-border px-2.5 py-1">
              {selectedQuality?.label[locale] ?? quality}
            </span>
            <span className="rounded-full border border-border px-2.5 py-1">
              {transparent ? "TRANSPARENT" : "AUTO BG"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
