import * as React from "react"

import { cn } from "@/lib/utils"

export type SegmentedOption = {
  value: string
  label: string
  icon?: React.ReactNode
}

export function SegmentedControl({
  value,
  options,
  onChange,
  ariaLabel,
  showLabelOnMobile = true,
  className,
}: {
  value: string
  options: SegmentedOption[]
  onChange: (value: string) => void
  ariaLabel?: string
  showLabelOnMobile?: boolean
  className?: string
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "inline-grid auto-cols-fr grid-flow-col gap-1 rounded-lg border border-border bg-muted/50 p-1",
        className
      )}
    >
      {options.map((option) => {
        const selected = value === option.value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={selected}
            title={option.label}
            className={cn(
              "inline-flex h-8 min-w-0 items-center justify-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-[background-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-500/30",
              selected
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.icon}
            {option.label ? (
              <span className={cn(showLabelOnMobile ? "" : "hidden sm:inline")}>
                {option.label}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
