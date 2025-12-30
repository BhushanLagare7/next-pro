/**
 * Authentication Proxy Middleware
 *
 * This file implements a lightweight middleware proxy for optimistic authentication redirects.
 * It performs a basic session cookie check to redirect unauthenticated users before page loads.
 *
 * @remarks
 * SECURITY WARNING: This is NOT a secure authentication barrier. Session cookies can be
 * manipulated client-side, so this should only be used for UX optimization (preventing
 * unnecessary page loads). Always implement proper server-side authentication checks in
 * each protected route/page using Convex auth or server actions.
 *
 * @see {@link https://better-auth.com} - Better Auth documentation
 */

import { NextRequest, NextResponse } from "next/server";

import { getSessionCookie } from "better-auth/cookies";

/**
 * Middleware proxy function that performs optimistic authentication checks.
 *
 * Checks for the presence of a session cookie and redirects to login if absent.
 * This provides a better UX by catching unauthenticated users early, but should
 * not be relied upon as the sole authentication mechanism.
 *
 * @param request - The incoming Next.js request object
 * @returns NextResponse redirecting to login or allowing request to proceed
 *
 * @remarks
 * - Cookie presence does NOT guarantee valid authentication
 * - Backend routes must independently verify authentication
 * - Used to reduce unnecessary page loads for logged-out users
 * - Session validation still happens server-side in each protected endpoint
 */
export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // Optimistically redirect if no session cookie is present.
  // This improves UX but is NOT a security measure - cookies can be forged.
  // Actual auth verification must happen in server components/actions.
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

/**
 * Middleware configuration specifying which routes this proxy applies to.
 *
 * @remarks
 * Only routes listed in the matcher array will trigger this middleware.
 * Add new protected routes here to enable optimistic auth redirects.
 */
export const config = {
  matcher: ["/blog", "/create"], // Routes requiring authentication (UX-level check only)
};
