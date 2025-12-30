/**
 * Shared Layout for Public Routes
 *
 * Provides common layout elements (navbar) for public-facing pages.
 * Uses Next.js route groups (parentheses in folder name) to share layout
 * without affecting URL structure.
 *
 * @remarks
 * Route group pattern: (shared-layout)
 * - Applies to: /  (landing), /blog, /create
 * - Excludes: /auth/* routes (have separate layout)  * - Does NOT add "/shared-layout" to URLs
 *
 * This keeps navbar consistent across main app while allowing
 * auth pages to have their own distinct layout.
 */

import { Navbar } from "@/components/web/navbar";

/**
 * Shared layout component.
 *
 * @param children - Page content from nested routes
 */
const SharedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default SharedLayout;
