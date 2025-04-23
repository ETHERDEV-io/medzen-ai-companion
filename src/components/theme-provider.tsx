
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Define the ThemeProviderProps interface directly since we can't find the import
interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
  storageKey?: string
  attribute?: string
  value?: object
  forcedTheme?: string
  enableSystem?: boolean
  enableColorScheme?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ 
  children, 
  ...props 
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
