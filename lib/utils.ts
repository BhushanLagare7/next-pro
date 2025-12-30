/**
 * Tailwind CSS Utility Functions
 *
 * Helper functions for working with Tailwind CSS classes.
 *
 * @remarks
 * This file provides the `cn` utility used throughout the application
 * for conditional and dynamic class name composition.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names with Tailwind CSS conflict resolution.
 *
 * @param inputs - Class values to merge (strings, objects, arrays, conditionals)
 * @returns Merged class string with proper Tailwind specificity
 *
 * @example
 * // Conditional classes
 * cn("px-4", isActive && "bg-primary", className)
 *
 * // With variants - twMerge handles conflicts
 * cn("p-4", "p-2") // Returns "p-2" (last wins)
 *
 * @remarks
 * Why This Exists:
 * Tailwind classes can conflict (e.g., "p-4" and "p-2" both set padding).
 * Regular string concatenation keeps both, causing unpredictable styles.
 *
 * How It Works:
 * 1. clsx: Handles conditional class composition (like classnames package)
 * 2. twMerge: Intelligently merges Tailwind classes, last value wins
 *
 * This pattern is standard in shadcn/ui components and allows component
 * consumers to override default styles predictably.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
