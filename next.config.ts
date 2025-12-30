/**
 * Next.js Application Configuration
 *
 * Defines build-time and runtime configuration for the Next.js application.
 *
 * @remarks
 * - cacheComponents: Enables component-level caching for improved build performance
 * - images: Configures external image domains for Next.js Image Optimization
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/next-config-js} - Next.js Config Docs
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Enable component-level caching during builds.
   * Speeds up subsequent builds by caching unchanged React Server Components.
   */
  cacheComponents: true,

  /**
   * Image optimization configuration for external domains.
   *
   * @remarks
   * Remote patterns allow Next.js Image component to optimize images from Convex storage.
   * The Convex hostname is environment-specific (changes per deployment).
   * Using wildcard pathname (/**) allows all images from this domain.
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "neighborly-orca-917.convex.cloud", // Convex file storage domain
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
