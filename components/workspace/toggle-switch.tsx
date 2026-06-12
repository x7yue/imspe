import * as React from "react"

import { cn } from "@/lib/utils"

export function ToggleSwitch({
  checked,
  onChange,
  label,
  hint,
  icon,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  hint: string
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="grid w-full gap-3 rounded-lg border border-border bg-background p-3 text-left transition-[border-color] hover:border-cyan-500/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-500/25 sm:grid-cols-[1fr_auto] sm:items-center"
    >
      <span className="min-w-0">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          {icon ? <span className="text-cyan-600 dark:text-cyan-300">{icon}</span> : null}
          {label}
        </span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">{hint}</span>
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full border transition-colors",
          checked
            ? "border-cyan-500 bg-cyan-500 dark:border-cyan-300 dark:bg-cyan-300"
            : "border-border bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-1"
          )}
        />
      </span>
    </button>
  )
}
