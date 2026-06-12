"use client"

import * as React from "react"
import { AlertCircle, ImagePlus, Loader2, Paintbrush, Wand2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, fieldInputClassName } from "./field"
import { OutputControls } from "./output-controls"
import { ReferenceUploader } from "./reference-uploader"
import { SectionCard } from "./section-card"
import { useWorkspace } from "./workspace-context"

export function ComposeForm() {
  const {
    text,
    prompt,
    setPrompt,
    fieldErrors,
    clearFieldError,
    dismissError,
    promptRef,
    generateImage,
    isLoading,
    isEditMode,
    error,
  } = useWorkspace()

  return (
    <form
      onSubmit={generateImage}
      className="flex min-w-0 flex-col gap-4 xl:h-full xl:min-h-0"
    >
      <div className="flex min-h-0 flex-col gap-4 xl:flex-1 xl:overflow-y-auto xl:pr-1.5">
        <SectionCard
          title={text.reference}
          hint={text.referenceHint}
          icon={<ImagePlus className="size-4" strokeWidth={1.8} aria-hidden />}
        >
          <ReferenceUploader />
        </SectionCard>

        <SectionCard
          title={text.compose}
          hint={text.composeHint}
          icon={<Paintbrush className="size-4" strokeWidth={1.8} aria-hidden />}
        >
          <Field
            id="prompt"
            label={text.prompt}
            hint={text.promptHint}
            error={fieldErrors.prompt}
            icon={<Paintbrush className="size-3.5" strokeWidth={1.8} aria-hidden />}
          >
            <textarea
              ref={promptRef}
              id="prompt"
              name="prompt"
              value={prompt}
              onChange={(event) => {
                setPrompt(event.target.value)
                clearFieldError("prompt")
              }}
              placeholder={text.promptPlaceholder}
              className={`${fieldInputClassName} min-h-36 resize-y py-3 leading-6`}
              aria-invalid={Boolean(fieldErrors.prompt)}
              aria-describedby={fieldErrors.prompt ? "prompt-error" : undefined}
            />
          </Field>
        </SectionCard>

        <OutputControls />
      </div>

      <div className="grid shrink-0 gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        {error ? (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-rose-700 dark:text-rose-200"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={1.8} aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold">{text.errorTitle}</p>
              <p className="mt-0.5 max-h-24 overflow-y-auto break-words text-sm leading-5 [overflow-wrap:anywhere]">
                {error}
              </p>
            </div>
            <button
              type="button"
              onClick={dismissError}
              aria-label={text.errorDismiss}
              className="-mr-1 -mt-0.5 grid size-6 shrink-0 place-items-center rounded-md text-rose-700/70 transition-colors hover:bg-rose-500/15 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30 dark:text-rose-200/70 dark:hover:text-rose-100"
            >
              <X className="size-3.5" strokeWidth={1.8} aria-hidden />
            </button>
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={isLoading}
          aria-live="polite"
          className="h-11 bg-cyan-500 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-600 disabled:opacity-70 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin motion-reduce:animate-none" strokeWidth={1.8} aria-hidden />
          ) : isEditMode ? (
            <ImagePlus className="size-4" strokeWidth={1.8} aria-hidden />
          ) : (
            <Wand2 className="size-4" strokeWidth={1.8} aria-hidden />
          )}
          {isLoading ? text.generating : isEditMode ? text.edit : text.generate}
        </Button>
      </div>
    </form>
  )
}
