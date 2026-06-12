import * as React from "react"

import { cn } from "@/lib/utils"

export function StatusPill({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode
  tone?: "neutral" | "cyan" | "rose" | "amber"
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        tone === "cyan" &&
          "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:border-cyan-300/25 dark:bg-cyan-300/10 dark:text-cyan-200",
        tone === "rose" &&
          "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:border-rose-300/25 dark:bg-rose-300/10 dark:text-rose-200",
        tone === "amber" &&
          "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-300/25 dark:bg-amber-300/10 dark:text-amber-200",
        tone === "neutral" && "border-border bg-muted/60 text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  )
}
