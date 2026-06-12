"use client"

import * as React from "react"

import { ComposeForm } from "@/components/workspace/compose-form"
import { ConnectionPanel } from "@/components/workspace/connection-panel"
import { PreviewCanvas } from "@/components/workspace/preview-canvas"
import { TopBar } from "@/components/workspace/top-bar"
import { useImageWorkspace } from "@/components/workspace/use-image-workspace"
import { WorkspaceProvider } from "@/components/workspace/workspace-context"

export function ImageGeneratorWorkspace() {
  const workspace = useImageWorkspace()

  return (
    <WorkspaceProvider value={workspace}>
      <main className="flex min-h-[100dvh] flex-col bg-background text-foreground xl:h-[100dvh] xl:min-h-0 xl:overflow-hidden">
        <TopBar />
        <ConnectionPanel />

        <div className="mx-auto grid w-full max-w-[1600px] flex-1 gap-4 px-4 py-4 xl:min-h-0 xl:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)] xl:overflow-hidden">
          <ComposeForm />
          <PreviewCanvas />
        </div>
      </main>
    </WorkspaceProvider>
  )
}
