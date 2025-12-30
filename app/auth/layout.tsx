/**
 * Authentication Layout
 *
 * Shared layout for auth pages (login, sign-up) providing:
 * - Centered, card-based design for focused auth flows
 * - Navigation back to homepage
 * - SEO metadata optimized for auth pages
 *
 * @remarks
 * Design Rationale:
 * - Minimal distractions: no navbar, just back button
 * - Centered layout focuses attention on auth form
 * - Full viewport height ensures vertical centering
 * - Absolute positioned back button always visible
 *
 * SEO Strategy:
 * - robots.txt prevents indexing (auth pages shouldn't appear in search)
 * - Still includes Open Graph for security (if accidentally shared)
 * - Generic "Authentication" title prevents keyword stuffing
 */

import { Metadata } from "next";
import Link from "next/link";

import { ArrowLeft } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Authentication",
  description:
    "Sign in or create an account to access NextPro. Secure authentication for your blog experience.",
  openGraph: {
    title: "Authentication | NextPro",
    description:
      "Sign in or create an account to access NextPro. Secure authentication for your blog experience.",
    type: "website",
    locale: "en_US",
    siteName: "NextPro",
  },
  robots: {
    index: false, // Prevent search engines from indexing auth pages
    follow: false, // Don't follow links from auth pages
  },
};

/**
 * Auth layout component.
 *
 * @param children - Auth page content (login or sign-up form)
 */
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="absolute top-5 left-5">
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          <HugeiconsIcon icon={ArrowLeft} className="size-4" />
          Back to Home
        </Link>
      </div>
      <div className="mx-auto w-full max-w-md">{children}</div>
    </div>
  );
};

export default AuthLayout;
