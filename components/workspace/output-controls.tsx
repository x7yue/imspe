"use client"

import * as React from "react"
import { SlidersHorizontal } from "lucide-react"

import { FORMAT_OPTIONS, QUALITY_OPTIONS, SIZE_OPTIONS } from "./copy"
import { Field, fieldInputClassName } from "./field"
import { OptionGrid } from "./option-grid"
import { SectionCard } from "./section-card"
import { SegmentedControl } from "./segmented-control"
import { useWorkspace } from "./workspace-context"

export function OutputControls() {
  const {
    text,
    locale,
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
    fieldErrors,
    clearFieldError,
    countRef,
  } = useWorkspace()

  return (
    <SectionCard
      title={text.output}
      hint={text.outputHint}
      icon={<SlidersHorizontal className="size-4" strokeWidth={1.8} aria-hidden />}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <p className="text-sm font-medium text-foreground">{text.size}</p>
          <OptionGrid
            value={size}
            options={SIZE_OPTIONS}
            onChange={setSize}
            getLabel={(value) =>
              SIZE_OPTIONS.find((option) => option.value === value)?.label[locale] ?? value
            }
            getDetail={(value) =>
              SIZE_OPTIONS.find((option) => option.value === value)?.detail ?? value
            }
          />
        </div>

        <div className="grid gap-2">
          <p className="text-sm font-medium text-foreground">{text.quality}</p>
          <OptionGrid
            value={quality}
            options={QUALITY_OPTIONS}
            onChange={setQuality}
            getLabel={(value) =>
              QUALITY_OPTIONS.find((option) => option.value === value)?.label[locale] ?? value
            }
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(110px,0.5fr)] md:items-end">
        <div className="grid gap-2">
          <p className="text-sm font-medium text-foreground">{text.format}</p>
          <SegmentedControl
            ariaLabel={text.format}
            value={format}
            options={FORMAT_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            onChange={setFormat}
            className="w-full"
          />
        </div>

        <Field id="image-count" label={text.imageCount} error={fieldErrors.count}>
          <input
            ref={countRef}
            id="image-count"
            name="n"
            value={countInput}
            onChange={(event) => {
              setCountInput(event.target.value)
              clearFieldError("count")
            }}
            type="number"
            min={1}
            max={4}
            inputMode="numeric"
            autoComplete="off"
            className={fieldInputClassName}
            aria-invalid={Boolean(fieldErrors.count)}
            aria-describedby={fieldErrors.count ? "image-count-error" : undefined}
          />
        </Field>
      </div>

      <label className="grid cursor-pointer gap-3 rounded-lg border border-border bg-background p-3 transition-[border-color] hover:border-cyan-500/40 sm:grid-cols-[1fr_auto] sm:items-center">
        <span className="min-w-0">
          <span className="block text-sm font-medium text-foreground">{text.transparent}</span>
          <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
            {text.transparentHint}
          </span>
        </span>
        <input
          checked={transparent}
          onChange={(event) => setTransparent(event.target.checked)}
          type="checkbox"
          name="transparent_background"
          className="size-5 accent-cyan-600 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-500/30"
        />
      </label>
    </SectionCard>
  )
}
