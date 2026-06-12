"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowDownToLine } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { GeneratedImage } from "./types"

export function ImageResult({
  image,
  index,
  format,
  resultMetaLabel,
  revisedPromptLabel,
  generatedOutputLabel,
  downloadLabel,
}: {
  image: GeneratedImage
  index: number
  format: string
  resultMetaLabel: string
  revisedPromptLabel: string
  generatedOutputLabel: string
  downloadLabel: string
}) {
  return (
    <figure className="group relative grid min-h-[260px] overflow-hidden rounded-lg border border-white/10 bg-neutral-900 xl:min-h-0">
      <Image
        src={image.src}
        alt={`${resultMetaLabel} ${index + 1}`}
        width={1536}
        height={1536}
        unoptimized
        className="h-full min-h-[260px] w-full object-contain xl:min-h-0"
      />
      <figcaption className="absolute inset-x-3 bottom-3 grid gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <div className="max-h-28 overflow-auto rounded-lg border border-white/10 bg-black/80 px-3 py-2 text-xs leading-5 text-neutral-200 shadow-lg backdrop-blur">
          <span className="mb-1 block font-medium text-cyan-300">
            {image.revisedPrompt ? revisedPromptLabel : generatedOutputLabel}
          </span>
          <span className="break-words">{image.revisedPrompt || generatedOutputLabel}</span>
        </div>
        <Button
          asChild
          size="sm"
          className="w-fit bg-cyan-400 text-slate-950 hover:bg-cyan-300"
        >
          <a href={image.src} download={`pixel-bench-${index + 1}.${format}`}>
            <ArrowDownToLine className="size-3.5" strokeWidth={1.8} aria-hidden />
            {downloadLabel}
          </a>
        </Button>
      </figcaption>
    </figure>
  )
}
