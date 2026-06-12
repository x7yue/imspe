"use client"

import * as React from "react"
import { Dialog } from "radix-ui"
import { KeyRound, Save, Server, ShieldCheck, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { MODEL_OPTIONS } from "./copy"
import { Field, fieldInputClassName } from "./field"
import { StatusPill } from "./status-pill"
import { ToggleSwitch } from "./toggle-switch"
import { getSecretPreview } from "./utils"
import { useWorkspace } from "./workspace-context"

export function ConnectionPanel() {
  const {
    text,
    locale,
    settingsOpen,
    setSettingsOpen,
    baseUrl,
    setBaseUrl,
    apiKey,
    setApiKey,
    model,
    setModel,
    rememberConnection,
    setRememberConnection,
    isConfigured,
    fieldErrors,
    clearFieldError,
    baseUrlRef,
    apiKeyRef,
  } = useWorkspace()

  return (
    <Dialog.Root open={settingsOpen} onOpenChange={setSettingsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content
          id="connection-settings"
          className="fixed left-1/2 top-1/2 z-50 grid max-h-[90dvh] w-[calc(100vw-2rem)] max-w-[640px] -translate-x-1/2 -translate-y-1/2 gap-5 overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
        >
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <Dialog.Title className="flex items-center gap-2 text-base font-semibold text-foreground">
                <ShieldCheck className="size-4 text-cyan-600 dark:text-cyan-300" strokeWidth={1.8} />
                {text.connection}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-xs leading-5 text-muted-foreground">
                {text.connectionHint}
              </Dialog.Description>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <StatusPill tone={isConfigured ? "cyan" : "amber"}>
                <span>{isConfigured ? text.configured : text.notConfigured}</span>
              </StatusPill>
              <Dialog.Close
                aria-label={text.settingsClose}
                className="grid size-8 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-cyan-500/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-500/25"
              >
                <X className="size-4" strokeWidth={1.8} aria-hidden />
              </Dialog.Close>
            </div>
          </div>

          <div className="grid gap-4">
            <Field
              id="base-url"
              label={text.baseUrl}
              hint={text.baseUrlHint}
              error={fieldErrors.baseUrl}
              icon={<Server className="size-3.5" strokeWidth={1.8} aria-hidden />}
            >
              <input
                ref={baseUrlRef}
                id="base-url"
                value={baseUrl}
                onChange={(event) => {
                  setBaseUrl(event.target.value)
                  clearFieldError("baseUrl")
                }}
                type="url"
                inputMode="url"
                autoComplete="url"
                className={fieldInputClassName}
                aria-invalid={Boolean(fieldErrors.baseUrl)}
                aria-describedby={fieldErrors.baseUrl ? "base-url-error" : undefined}
              />
            </Field>

            <Field
              id="api-key"
              label={text.apiKey}
              hint={getSecretPreview(apiKey, locale)}
              error={fieldErrors.apiKey}
              icon={<KeyRound className="size-3.5" strokeWidth={1.8} aria-hidden />}
            >
              <input
                ref={apiKeyRef}
                id="api-key"
                value={apiKey}
                onChange={(event) => {
                  setApiKey(event.target.value)
                  clearFieldError("apiKey")
                }}
                type="password"
                autoComplete="off"
                className={fieldInputClassName}
                aria-invalid={Boolean(fieldErrors.apiKey)}
                aria-describedby={fieldErrors.apiKey ? "api-key-error" : undefined}
              />
            </Field>

            <div className="grid gap-2">
              <p className="text-sm font-medium text-foreground">{text.model}</p>
              <div className="grid gap-2">
                {MODEL_OPTIONS.map((option) => {
                  const selected = model === option.value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setModel(option.value)}
                      aria-pressed={selected}
                      className={cn(
                        "grid min-h-10 gap-0.5 rounded-lg border px-3 py-2 text-left transition-[border-color,background-color] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-500/30",
                        selected
                          ? "border-cyan-500 bg-cyan-500/10 dark:border-cyan-300/50 dark:bg-cyan-300/10"
                          : "border-border bg-background hover:border-cyan-500/40"
                      )}
                    >
                      <span className="text-sm font-medium text-foreground">{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.description[locale]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <ToggleSwitch
              checked={rememberConnection}
              onChange={setRememberConnection}
              label={text.remember}
              hint={text.rememberHint}
              icon={<Save className="size-4" strokeWidth={1.8} aria-hidden />}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
