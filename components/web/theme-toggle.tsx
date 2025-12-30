/**
 * Theme Toggle Component
 *
 * Dropdown button for switching between light, dark, and system themes.
 * Uses next-themes for persistent theme management.
 *
 * @remarks
 * Icon Animation Pattern:
 * The sun and moon icons both render but use CSS transforms:
 * - Light mode: Sun visible (scale-100), Moon hidden (scale-0)
 * - Dark mode: Sun hidden (scale-0), Moon visible (scale-100)
 *
 * This creates a smooth crossfade effect when theme changes.
 * The rotate transforms add visual interest to the transition.
 *
 * Theme Options:
 * - Light: Force light mode
 * - Dark: Force dark mode
 * - System: Follow OS preference (prefers-color-scheme)
 */

"use client";

import { useTheme } from "next-themes";

import { Moon02Icon, SunIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Theme toggle dropdown with animated sun/moon icons.
 *
 * @remarks
 * The button shows both icons simultaneously with CSS opacity/scale.
 * This avoids flash of wrong icon during hydration.
 */
export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="icon" className="w-16" />}
      >
        {/* Sun icon - visible in light mode, hidden in dark */}
        <HugeiconsIcon
          icon={SunIcon}
          className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
        />
        {/* Moon icon - hidden in light mode, visible in dark */}
        <HugeiconsIcon
          icon={Moon02Icon}
          className="h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
        />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
