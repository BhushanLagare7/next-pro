/**
 * Authentication Schemas
 *
 * Zod schemas for validating user authentication forms.
 * These schemas enforce security constraints and provide user-friendly error messages.
 *
 * @remarks
 * Validation Strategy:
 * - Client-side validation for immediate feedback (no server round-trip)
 * - Server-side re-validation for security (never trust client)
 * - Error messages focus on constraint explanation, not implementation details
 *
 * Password Requirements:
 * - Minimum 8 characters balances security with usability
 * - No maximum length (bcrypt handles long passwords fine)
 * - No complexity requirements (length > complexity for security)
 *
 * @see {@link https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html} - OWASP Auth Guidelines
 */

import * as z from "zod";

/**
 * Sign-up form validation schema.
 *
 * @remarks
 * Name field requirements:
 * - Minimum 3 characters prevents single-letter/empty names
 * - Used for display purposes throughout the application
 * - No maximum to accommodate long names from various cultures
 *
 * Email validation:
 * - Zod's built-in email validation uses RFC 5322 standard
 * - Catches most common typos (missing @, .com, etc.)
 *
 * Password requirements:
 * - 8 character minimum follows NIST guidelines
 * - No special character requirements (improves UX without reducing security)
 * - Actual strength enforced by length requirement
 */
export const signUpSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

/**
 * Login form validation schema.
 *
 * @remarks
 * Simpler than signUpSchema (no name field required).
 * Uses same email and password validation as signup for consistency.
 *
 * Security Note:
 * Even though minimum password length is 8 characters, we still validate
 * on login to catch client-side errors early (before hitting server).
 * This also maintains consistent error messaging across auth flows.
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
