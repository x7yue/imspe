"use client"

import * as React from "react"

import type { ImageWorkspaceValue } from "./use-image-workspace"

const WorkspaceContext = React.createContext<ImageWorkspaceValue | null>(null)

export function WorkspaceProvider({
  value,
  children,
}: {
  value: ImageWorkspaceValue
  children: React.ReactNode
}) {
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace() {
  const value = React.useContext(WorkspaceContext)

  if (!value) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider")
  }

  return value
}
