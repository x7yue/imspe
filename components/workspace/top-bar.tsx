"use client"

import * as React from "react"
import {
  ImagePlus,
  Languages,
  Monitor,
  Moon,
  Settings2,
  Sparkles,
  Sun,
  Wand2,
} from "lucide-react"

import { SegmentedControl } from "./segmented-control"
import { StatusPill } from "./status-pill"
import type { ThemeChoice } from "./types"
import { useWorkspace } from "./workspace-context"

export function TopBar() {
  const {
    text,
    locale,
    setLocale,
    theme,
    setTheme,
    settingsOpen,
    setSettingsOpen,
    isEditMode,
  } = useWorkspace()

  // next-themes resolves `theme` only on the client. Defer reflecting the
  // active value until after mount so server and first client render agree.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot mount flag for hydration-safe theme rendering
    setMounted(true)
  }, [])

  const themeOptions = [
    { value: "light", label: text.themeLight, icon: <Sun className="size-3.5" aria-hidden /> },
    { value: "dark", label: text.themeDark, icon: <Moon className="size-3.5" aria-hidden /> },
    { value: "system", label: text.themeSystem, icon: <Monitor className="size-3.5" aria-hidden /> },
  ]

  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-cyan-500 text-white shadow-sm dark:bg-cyan-400 dark:text-slate-950">
          <Wand2 className="size-5" strokeWidth={1.8} aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{text.appName}</p>
          <p className="truncate text-xs text-muted-foreground">{text.appMeta}</p>
        </div>
      </div>

      <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
        <StatusPill tone={isEditMode ? "amber" : "cyan"}>
          {isEditMode ? (
            <ImagePlus className="size-3.5" strokeWidth={1.8} aria-hidden />
          ) : (
            <Sparkles className="size-3.5" strokeWidth={1.8} aria-hidden />
          )}
          <span>{isEditMode ? text.modeEdit : text.modeGenerate}</span>
        </StatusPill>

        <SegmentedControl
          ariaLabel={text.theme}
          value={mounted ? theme ?? "system" : ""}
          options={themeOptions}
          onChange={(value) => setTheme(value as ThemeChoice)}
          showLabelOnMobile={false}
        />

        <button
          type="button"
          onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
          aria-label={text.languageAlt}
          title={text.languageAlt}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:border-cyan-500/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-500/25"
        >
          <Languages className="size-4" strokeWidth={1.8} aria-hidden />
          <span>{text.language}</span>
        </button>

        <button
          type="button"
          onClick={() => setSettingsOpen((current) => !current)}
          aria-expanded={settingsOpen}
          aria-controls="connection-settings"
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:border-cyan-500/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-500/25 aria-expanded:border-cyan-500/50 aria-expanded:bg-cyan-500/10"
        >
          <Settings2 className="size-4" strokeWidth={1.8} aria-hidden />
          <span className="hidden sm:inline">{text.settings}</span>
        </button>
      </div>
    </header>
  )
}
