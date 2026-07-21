import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Canonical role resolver — mirrors the client-side resolveRoleRoute()
 * Returns the dashboard path for a given cookieRole value.
 */
function getDashboardForRole(cookieRole: string): string {
  return "/customer/dashboard";
}

/**
 * Returns true if the given path is allowed for this cookieRole.
 * Workers paths do not exist anymore.
 */
function isPathAllowedForRole(pathname: string, cookieRole: string): boolean {
  if (pathname.startsWith("/worker")) return false;
  return true; // All other paths allowed
}

export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session (clears expired tokens)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    const errorMsg = error.message?.toLowerCase() || "";
    if (
      errorMsg.includes("refresh token") ||
      errorMsg.includes("refresh_token") ||
      errorMsg.includes("invalid_grant") ||
      error.status === 400
    ) {
      request.cookies.getAll().forEach((cookie) => {
        if (cookie.name.startsWith("sb-")) {
          supabaseResponse.cookies.delete(cookie.name);
        }
      });
    }
  }

  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");

  const isProtectedPage =
    pathname === "/" ||
    pathname.startsWith("/jobs") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/worker") ||
    pathname.startsWith("/customer");

  // Redirect unauthenticated users away from protected pages
  if (!user && isProtectedPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  if (user) {
    // ──────────────────────────────────────────────────────────────────────────
    // Determine the active role.
    //
    // Source of truth priority:
    //   1. sb-active-role cookie (set synchronously at login — most reliable)
    //   2. user_metadata.activeRole (persisted via updateUser after login)
    //   3. Primary role from user_metadata.role
    // ──────────────────────────────────────────────────────────────────────────
    const rawRole = user.user_metadata?.role;
    const primaryRole = rawRole ? String(rawRole).toUpperCase() : "CUSTOMER";

    // Build the allowed roles list — normalize ALL to lowercase
    const metaRoles: string[] = (user.user_metadata?.roles || [primaryRole]).map((r: string) =>
      String(r).toLowerCase()
    );

    // Cookie value — always lowercase when set by our login page
    const rawCookieRole = request.cookies.get("sb-active-role")?.value?.toLowerCase();

    // Validate the cookie role is among the user's actual roles or sub-types
    const validRoles = new Set([
      ...metaRoles,
      // Expand WORKER to include all sub-types if user has worker role
      ...(metaRoles.includes("worker") ? ["worker", "freelancer", "business"] : []),
    ]);

    // For customer-only frontend app, active role is always customer
    const cookieRole = "customer";

    // ── Redirect authenticated users away from auth pages or root ──────────
    if (isAuthPage || pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = getDashboardForRole(cookieRole);
      const redirectResponse = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
      // Ensure cookie is set in redirect response
      redirectResponse.cookies.set("sb-active-role", cookieRole, { path: "/", maxAge: 31536000, sameSite: "lax" });
      return redirectResponse;
    }

    // ── Strict role-based route protection ────────────────────────────────
    if (!isPathAllowedForRole(pathname, cookieRole)) {
      const url = request.nextUrl.clone();
      url.pathname = getDashboardForRole(cookieRole);
      const redirectResponse = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
      return redirectResponse;
    }
  }

  return supabaseResponse;
};
