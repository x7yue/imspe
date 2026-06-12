"use client"

import * as React from "react"
import { ImagePlus, Loader2, Paintbrush, Wand2 } from "lucide-react"

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
            className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm leading-5 text-rose-700 dark:text-rose-200"
          >
            {error}
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
