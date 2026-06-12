import * as React from "react"

import { cn } from "@/lib/utils"

export function Field({
  id,
  label,
  hint,
  error,
  icon,
  children,
}: {
  id: string
  label: string
  hint?: React.ReactNode
  error?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <div className="flex min-w-0 items-end justify-between gap-3">
        <label
          htmlFor={id}
          className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground"
        >
          {icon ? <span className="shrink-0 text-cyan-600 dark:text-cyan-300">{icon}</span> : null}
          <span className="truncate">{label}</span>
        </label>
        {hint ? (
          <div className="min-w-0 text-right text-xs text-muted-foreground">{hint}</div>
        ) : null}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs leading-5 text-rose-600 dark:text-rose-300">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export const fieldInputClassName = cn(
  "h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-[border-color,box-shadow]",
  "placeholder:text-muted-foreground/70",
  "focus-visible:border-cyan-500 focus-visible:ring-3 focus-visible:ring-cyan-500/20",
  "aria-[invalid=true]:border-rose-500 aria-[invalid=true]:ring-3 aria-[invalid=true]:ring-rose-500/15"
)
