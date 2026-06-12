import * as React from "react"

import { cn } from "@/lib/utils"

export function SectionCard({
  title,
  hint,
  icon,
  children,
  className,
}: {
  title: string
  hint?: string
  icon: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "grid gap-4 rounded-xl border border-border bg-card p-4 shadow-sm",
        className
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-cyan-500/10 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-200">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {hint ? (
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{hint}</p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  )
}
