/**
 * Search Input Component
 *
 * Real-time search autocomplete for blog posts using Convex reactive queries.
 * Displays search results in a dropdown as user types.
 *
 * @remarks
 * Real-Time Search Pattern:
 * - User types in input (controlled component)
 * - After 2+ characters, Convex query fires automatically
 * - Results update in real-time via Convex subscriptions
 * - No explicit debounce needed (Convex handles query optimization)
 *
 * "skip" Parameter:
 * When query is < 2 chars, we pass "skip" instead of args.
 * This tells Convex to not execute the query at all,
 * avoiding unnecessary backend calls for empty/short queries.
 *
 * @see {@link api.posts.searchPost} - Server-side search implementation
 */

import { useState } from "react";
import Link from "next/link";

import { useQuery } from "convex/react";
import { Loading03Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { api } from "@/convex/_generated/api";

import { Input } from "../ui/input";

/**
 * Search input with real-time autocomplete dropdown.
 *
 * @remarks
 * State Management:
 * - searchQuery: Current input value
 * - open: Whether dropdown is visible
 *
 * Results Behavior:
 * - undefined: Query is loading
 * - []: No matches found
 * - [...]: List of matching posts
 */
export const SearchInput = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  // Skip query if less than 2 characters (avoid noise from single-char searches)
  const results = useQuery(
    api.posts.searchPost,
    searchQuery.length >= 2 ? { query: searchQuery, limit: 5 } : "skip"
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setOpen(true);
  };

  return (
    <div className="relative z-10 w-full max-w-sm">
      <div className="relative">
        <HugeiconsIcon
          icon={Search01Icon}
          className="absolute left-2.5 top-2.5 size-4 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder="Search Posts..."
          className="pl-8 w-full bg-background"
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>

      {/* Dropdown only visible when open AND query is long enough */}
      {open && searchQuery.length >= 2 && (
        <div className="absolute top-full mt-2 rounded-md border shadow-md outline-none bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95">
          {results === undefined ? (
            // Loading state while query executes
            <div className="flex justify-center items-center p-4 text-sm text-muted-foreground">
              <HugeiconsIcon
                icon={Loading03Icon}
                strokeWidth={2}
                className="mr-2 animate-spin size-4"
              />
              <span>Searching...</span>
            </div>
          ) : results.length === 0 ? (
            // No results found
            <p className="p-4 text-sm text-center text-muted-foreground">
              No results found
            </p>
          ) : (
            // Results list with links to post detail pages
            <div className="py-1">
              {results.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post._id}`}
                  className="flex flex-col px-4 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    setOpen(false);
                    setSearchQuery("");
                  }}
                >
                  <p className="font-medium truncate">{post.title}</p>
                  <p className="pt-1 text-xs text-muted-foreground">
                    {post.body.slice(0, 50)}...
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
