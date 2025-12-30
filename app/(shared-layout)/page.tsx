/**
 * Landing Page
 *
 * Marketing homepage showcasing the platform's value proposition and community focus.
 * Features responsive layout with theme-aware imagery and quote from Next.js creator.
 *
 * @remarks
 * Design Strategy:
 * - Hero section with community-driven messaging
 * - Dual image display (theme-responsive: dark/light variants)
 * - Blockquote from authority figure for credibility
 * - Responsive grid layout (mobile-first, stacks on small screens)
 *
 * The page is intentionally static (no data fetching) for fast initial load
 * and serves as the first impression for new visitors.
 */

import Image from "next/image";

/**
 * Landing page component.
 *
 * @remarks
 * Images use Next.js Image component for automatic optimization.
 * Theme-specific images improve visual consistency in dark/light modes.
 */
export default function Page() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-center">
          A Community Blog Built by Next.js Developers
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative mb-6 sm:mb-0">
            <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src="/next-pro-dark.png"
                className="hidden rounded-md dark:block"
                alt="Next.js illustration dark"
                width={1207}
                height={929}
              />
              <Image
                src="/next-pro-light.png"
                className="rounded-md shadow dark:hidden"
                alt="Next.js illustration light"
                width={1207}
                height={929}
              />
            </div>
          </div>

          <div className="relative space-y-4">
            <p className="text-muted-foreground text-lg">
              &ldquo;A community-driven platform where developers share their
              Next.js journey. Explore real-world tutorials, innovative
              projects, and expert insights that demonstrate the power and
              versatility of modern web development. Learn, contribute, and
              master the future of React applications.&rdquo;
            </p>

            <div className="pt-6">
              <blockquote className="border-l-4 pl-4">
                <p className="text-primary text-lg font-bold">
                  Develop. Preview. Ship.
                </p>

                <div className="mt-6 space-y-3">
                  <cite className="block font-medium">
                    Guillermo Rauch, Creator of Next.js
                  </cite>
                  <h2 className="text-xl font-bold">
                    Next<span className="text-primary">Pro</span>
                  </h2>
                </div>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
