"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    // Fonction pour basculer entre clair et sombre
    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer ring-0!"
            onClick={toggleTheme}
        >
            <Sun className="w-5! h-5! scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="w-5! h-5! absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
