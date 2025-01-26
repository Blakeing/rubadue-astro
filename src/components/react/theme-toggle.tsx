import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/react/ui/button";

export function ThemeToggle() {
  const [theme, setThemeState] = React.useState<"theme-light" | "dark">(
    "theme-light"
  );

  React.useEffect(() => {
    // Check system preference on initial load
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setThemeState(prefersDark ? "dark" : "theme-light");
    document.documentElement.classList[prefersDark ? "add" : "remove"]("dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "theme-light" : "dark";
    setThemeState(newTheme);
    document.documentElement.classList[newTheme === "dark" ? "add" : "remove"](
      "dark"
    );
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
