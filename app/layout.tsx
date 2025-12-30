/**
 * Root Layout Component
 *
 * Defines the base HTML structure and global providers for the entire application.
 * This layout wraps all pages and establishes core functionality like theming,
 * authentication state, and database connectivity.
 *
 * @remarks
 * Font Strategy:
 * - Noto Sans: Primary body font (variable --font-sans)
 * - Geist Sans: Modern sans-serif for headings/UI
 * - Geist Mono: Code blocks and technical content
 * All fonts loaded via Next.js font optimization for performance
 *
 * Metadata Strategy:
 * Comprehensive SEO optimization including:
 * - Title templates for consistent branding
 * - Open Graph tags for social sharing
 * - Twitter Card support
 * - Search engine directives
 *
 * Provider Nesting Order (outer to inner):
 * 1. ThemeProvider - Dark/light mode support
 * 2. ConvexClientProvider - Real-time database & auth
 * 3. Page content - Individual routes
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import { ConvexClientProvider } from "./ConvexClientProvider";

import "./globals.css";

// Primary font for body text - supports wide character range
const notoSans = Noto_Sans({ variable: "--font-sans" });

// Modern sans-serif for UI elements and headings
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Monospace font for code snippets and technical content
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NextPro",
    template: "%s | NextPro",
  },
  description:
    "A modern full-stack application built with Next.js, Convex, and TypeScript. Create, share, and engage with blog posts in real-time.",
  keywords: [
    "NextPro",
    "Next.js",
    "React",
    "TypeScript",
    "Convex",
    "Tailwind CSS",
    "Blog",
    "Real-time",
  ],
  authors: [{ name: "Bhushan Lagare" }],
  creator: "Bhushan Lagare",
  publisher: "Bhushan Lagare",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "NextPro",
    title: "NextPro",
    description:
      "A modern full-stack application built with Next.js, Convex, and TypeScript.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextPro",
    description:
      "A modern full-stack application built with Next.js, Convex, and TypeScript.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/**
 * Root layout function component.
 *
 * @param children - Nested page content and route segments
 *
 * @remarks
 * - suppressHydrationWarning on html tag prevents theme flash warnings
 * - Noto Sans applied to html for global CSS variable availability
 * - Geist fonts applied to body via className for Tailwind access
 * - antialiased class improves font rendering across browsers
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={notoSans.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="px-4 mx-auto w-full max-w-7xl md:px-6 lg:px-8">
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </main>
          <Toaster closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
