"use client"

import * as React from "react"
import { Trash2, UploadCloud, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useWorkspace } from "./workspace-context"

export function ReferenceUploader() {
  const {
    text,
    referenceFile,
    referencePreviewUrl,
    fieldErrors,
    onReferenceChange,
    removeReferenceImage,
    referenceInputRef,
  } = useWorkspace()

  return (
    <div
      className={cn(
        "grid gap-3 rounded-lg border border-dashed p-3 transition-[border-color,background-color]",
        referenceFile
          ? "border-cyan-500/50 bg-cyan-500/[0.06] dark:border-cyan-300/40 dark:bg-cyan-300/[0.06]"
          : "border-border bg-background hover:border-cyan-500/40"
      )}
    >
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <label htmlFor="reference-image" className="flex min-w-0 cursor-pointer items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-muted/50 text-cyan-600 dark:text-cyan-300">
            <UploadCloud className="size-5" strokeWidth={1.8} aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-foreground">
              {referenceFile ? referenceFile.name : text.referenceDrop}
            </span>
            <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
              {referenceFile ? text.referenceActive : text.referenceDropHint}
            </span>
          </span>
        </label>

        {referenceFile ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={removeReferenceImage}
            className="w-fit hover:border-rose-500/40 hover:text-rose-600 dark:hover:text-rose-300"
          >
            <Trash2 className="size-3.5" strokeWidth={1.8} aria-hidden />
            {text.referenceRemove}
          </Button>
        ) : null}
      </div>

      <input
        ref={referenceInputRef}
        id="reference-image"
        type="file"
        accept="image/*"
        onChange={onReferenceChange}
        className="sr-only"
      />

      {referencePreviewUrl ? (
        <div className="relative min-h-48 overflow-hidden rounded-lg border border-border bg-neutral-900">
          <div
            aria-label={referenceFile?.name ?? text.reference}
            role="img"
            className="absolute inset-0 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${referencePreviewUrl})` }}
          />
          <button
            type="button"
            onClick={removeReferenceImage}
            aria-label={text.referenceRemove}
            className="absolute right-3 top-3 grid size-8 place-items-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur transition-colors hover:bg-rose-600 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-300/40"
          >
            <X className="size-4" strokeWidth={1.8} aria-hidden />
          </button>
        </div>
      ) : null}

      {fieldErrors.reference ? (
        <p className="text-xs leading-5 text-rose-600 dark:text-rose-300">{fieldErrors.reference}</p>
      ) : null}
    </div>
  )
}
