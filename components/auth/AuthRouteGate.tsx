"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/lib/api/client";
import { isProtectedRoute } from "@/lib/auth/protected-routes";

const LOGIN_PATH = "/login";

/**
 * Client-side route guard.
 *
 * IMPORTANT — this is a *client* guard only. The app's auth token currently
 * lives in `localStorage`, which is not readable from Next.js 16's server-side
 * `proxy.ts` (it can only read cookies) or from Server Components. So this gate
 * redirects on mount, after the first client render. A fully SSR-safe guard
 * requires migrating auth state to an HTTP-only cookie set by the backend, at
 * which point this can become a `proxy.ts` cookie check (see docs/01-app/01-getting-started/16-proxy.md).
 */
export function AuthRouteGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isProtectedRoute(pathname) && !isAuthenticated()) {
      const from = encodeURIComponent(pathname);
      router.replace(`${LOGIN_PATH}?from=${from}`);
    }
  }, [router, pathname]);

  return <>{children}</>;
}
