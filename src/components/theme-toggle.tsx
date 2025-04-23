
"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <div className="flex items-center gap-1 px-1.5 rounded-lg bg-muted/10 transition-colors">
      <Sun className={`h-4 w-4 transition-colors ${theme === "light" ? "text-yellow-400" : "text-muted-foreground"}`} />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
        className="mx-1"
      />
      <Moon className={`h-4 w-4 transition-colors ${theme === "dark" ? "text-blue-500" : "text-muted-foreground"}`} />
    </div>
  )
}
