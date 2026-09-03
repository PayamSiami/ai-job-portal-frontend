/**
 * Routes that require an authenticated session.
 *
 * Matched at the client via `pathname.startsWith(...)`. Keep this list in sync
 * with the route groups/pages that perform user-scoped data fetching
 * (dashboard, profile, saved-jobs, applications, resumes, employer, settings).
 *
 * Public routes (/login, /register, /jobs, /blog, /, ...) intentionally stay
 * unprotected so the auth gate never blocks them.
 */
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/settings",
  "/applications",
  "/saved-jobs",
  "/resumes",
  "/employer",
] as const;

/** Returns true when the given pathname belongs to a protected route. */
export const isProtectedRoute = (pathname: string | null | undefined): boolean =>
  !!pathname && PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
