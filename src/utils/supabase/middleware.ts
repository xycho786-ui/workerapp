import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getDashboardForRole(cookieRole: string): string {
  if (cookieRole === "customer") {
    return "/customer/dashboard";
  }

  if (cookieRole === "worker" || cookieRole === "freelancer" || cookieRole === "business") {
    return "/customer/jobs";
  }

  return "/customer/dashboard";
}

function isPathAllowedForRole(pathname: string, cookieRole: string): boolean {
  if (pathname.startsWith("/admin")) return cookieRole === "admin";
  if (pathname.startsWith("/customer")) return true;
  if (pathname.startsWith("/worker")) {
    return cookieRole === "worker" || cookieRole === "freelancer" || cookieRole === "business";
  }
  return true;
}

function getUserFromRequest(request: NextRequest) {
  try {
    const allCookies = request.cookies.getAll();
    const authCookies = allCookies
      .filter(c => c.name.startsWith('sb-') && c.name.includes('-auth-token'))
      .sort((a, b) => a.name.localeCompare(b.name));
    if (authCookies.length > 0) {
      let rawVal = authCookies.map(c => c.value).join('');
      if (rawVal.startsWith('base64-')) {
        try {
          rawVal = Buffer.from(rawVal.slice(7), 'base64').toString('utf8');
        } catch (e) {
          // fallback if decode fails
        }
      }
      const parsed = JSON.parse(rawVal);
      let accessToken = "";
      if (Array.isArray(parsed)) {
        accessToken = parsed[0];
      } else if (parsed && typeof parsed === 'object') {
        accessToken = parsed.access_token;
      } else if (typeof parsed === 'string') {
        accessToken = parsed;
      }

      if (accessToken) {
        const parts = accessToken.split('.');
        if (parts.length === 3) {
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const padLen = (4 - (base64.length % 4)) % 4;
          const padded = base64 + '='.repeat(padLen);
          const payload = JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));

          if (payload && payload.sub && payload.email) {
            return {
              id: payload.sub,
              email: payload.email,
              role: 'authenticated',
              aud: 'authenticated',
              created_at: new Date().toISOString(),
              user_metadata: payload.user_metadata || {},
              app_metadata: payload.app_metadata || { provider: 'email', providers: ['email'] },
            } as any;
          }
        }
      }
    }
  } catch (e) {
    // Ignore parse errors
  }
  return null;
}

export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  let user = getUserFromRequest(request);
  let error: any = null;

  if (!user) {
    const host = request.headers.get("host") || "localhost:3002";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const currentSupabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("/api/supabase-mock")
      ? `${protocol}://${host}/api/supabase-mock`
      : process.env.NEXT_PUBLIC_SUPABASE_URL!;

    const supabase = createServerClient(currentSupabaseUrl, supabaseKey!, {
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

    try {
      const userRes = await supabase.auth.getUser();
      user = userRes.data.user;
      error = userRes.error;
    } catch (err) {
      user = null;
      error = null;
    }
  }

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

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/customer/dashboard";
    return NextResponse.redirect(url);
  }

  const isProtectedPage =
    pathname.startsWith("/jobs") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/worker") ||
    (pathname.startsWith("/customer") && pathname !== "/customer/dashboard");

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

    let cookieRole = rawCookieRole && validRoles.has(rawCookieRole) ? rawCookieRole : primaryRole.toLowerCase();

    if (!validRoles.has(cookieRole)) {
      cookieRole = metaRoles.includes("customer") ? "customer" : Array.from(validRoles)[0] || "customer";
    }

    // ── Redirect authenticated users away from auth pages or root ──────────
    if (isAuthPage) {
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

    if (pathname === "/") {
      supabaseResponse.cookies.set("sb-active-role", cookieRole, { path: "/", maxAge: 31536000, sameSite: "lax" });
      return supabaseResponse;
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
