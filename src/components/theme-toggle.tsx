
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"

const THEME_KEY = "medzen-theme";

function getStoredTheme() {
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light") return "light";
  if (stored === "dark") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">(getStoredTheme());

  // Update DOM & localStorage when theme changes
  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      window.localStorage.setItem(THEME_KEY, "dark");
    } else {
      document.documentElement.classList.remove("dark");
      window.localStorage.setItem(THEME_KEY, "light");
    }
  }, [theme]);

  // Listen to system theme changes only if not manually set
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const fn = () => {
      if (!window.localStorage.getItem(THEME_KEY)) {
        setTheme(mq.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  // Responsive toggle
  return (
    <div className="flex items-center gap-1 px-1.5 rounded-lg bg-muted/10 transition-colors">
      <Sun className={`h-4 w-4 transition-colors ${theme === "light" ? "text-yellow-400" : "text-muted-foreground"}`} />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked: boolean) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle theme"
        className="mx-1"
      />
      <Moon className={`h-4 w-4 transition-colors ${theme === "dark" ? "text-blue-500" : "text-muted-foreground"}`} />
    </div>
  )
}
