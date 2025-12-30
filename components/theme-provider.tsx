/**
 * Theme Provider Wrapper
 *
 * Client component wrapper for next-themes ThemeProvider.
 * Enables dark/light mode support throughout the application.
 *
 * @remarks
 * Why Wrapper Component:
 * next-themes ThemeProvider must be a client component ("use client"),
 * but we want to keep the root layout as a server component for performance.
 * This wrapper isolates the client boundary to just the theme provider.
 *
 * Usage:
 * Wrap application in root layout to enable theme switching.
 * Works with the ThemeToggle component for user control.
 *
 * @see {@link ThemeToggle} - UI component for switching themes
 * @see {@link https://github.com/pacocoursey/next-themes} - next-themes docs
 */

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Theme provider that wraps application with theme context.
 *
 * @param children - Application content to wrap
 * @param props - Props passed directly to NextThemesProvider
 *
 * @remarks
 * Props forwarding allows configuration from root layout:
 * - attribute: CSS attribute for theme class (usually "class")
 * - defaultTheme: Initial theme ("system", "light", or "dark")
 * - enableSystem: Enable OS preference detection
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
