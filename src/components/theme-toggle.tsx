
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

const THEME_KEY = "medzen-theme";

function getStoredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light") return "light";
  if (stored === "dark") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">(getStoredTheme());

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem(THEME_KEY, "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem(THEME_KEY, "light");
    }
  }, [theme]);

  // Listen to system theme change
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const fn = () => {
      if (!localStorage.getItem(THEME_KEY)) {
        setTheme(mq.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return (
    <div className="flex items-center gap-1 px-1.5 rounded-lg bg-muted/10 transition-colors">
      <Sun className="h-4 w-4 text-yellow-400" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked: boolean) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle theme"
        className="mx-1"
      />
      <Moon className="h-4 w-4 text-blue-500" />
    </div>
  )
}
