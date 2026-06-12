import * as React from "react"

import { cn } from "@/lib/utils"

export function OptionGrid({
  value,
  options,
  onChange,
  columns = "grid-cols-2",
  getLabel,
  getDetail,
}: {
  value: string
  options: Array<{ value: string }>
  onChange: (value: string) => void
  columns?: string
  getLabel: (value: string) => string
  getDetail?: (value: string) => string
}) {
  return (
    <div className={cn("grid gap-2", columns)}>
      {options.map((option) => {
        const selected = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={selected}
            className={cn(
              "flex h-14 flex-col justify-center rounded-lg border px-3 py-2 text-left text-sm font-medium transition-[border-color,background-color,color] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-500/30",
              selected
                ? "border-cyan-500 bg-cyan-500/10 text-foreground dark:border-cyan-300/50 dark:bg-cyan-300/10"
                : "border-border bg-background text-muted-foreground hover:border-cyan-500/40 hover:text-foreground"
            )}
          >
            <span className="block truncate">{getLabel(option.value)}</span>
            {getDetail ? (
              <span
                className={cn(
                  "mt-0.5 block font-mono text-[0.68rem] tracking-[0.08em]",
                  selected ? "text-cyan-700 dark:text-cyan-200" : "text-muted-foreground/70"
                )}
              >
                {getDetail(option.value)}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
