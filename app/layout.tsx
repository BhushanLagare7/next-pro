import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import { ConvexClientProvider } from "./ConvexClientProvider";

import "./globals.css";

const notoSans = Noto_Sans({ variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

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
