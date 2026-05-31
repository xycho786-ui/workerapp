import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const updateSession = async (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup');
  
  // Protect routes that require authentication
  const isProtectedPage = 
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname.startsWith('/jobs') || 
    request.nextUrl.pathname.startsWith('/chat') || 
    request.nextUrl.pathname.startsWith('/notifications') || 
    request.nextUrl.pathname.startsWith('/profile') ||
    request.nextUrl.pathname.startsWith('/worker') ||
    request.nextUrl.pathname.startsWith('/customer');

  // Redirect unauthenticated users away from protected pages
  if (!user && isProtectedPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    const redirectResponse = NextResponse.redirect(url);
    // Crucial: copy over session cookies so token refresh isn't lost
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  // Redirect authenticated users away from auth pages or root
  if (user && (isAuthPage || request.nextUrl.pathname === '/')) {
    const url = request.nextUrl.clone();
    const rawRole = user.user_metadata?.role;
    const role = rawRole ? String(rawRole).toUpperCase() : 'CUSTOMER';
    if (role === 'WORKER') {
      url.pathname = '/worker/dashboard';
    } else {
      url.pathname = '/customer/dashboard';
    }
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  // Strict Role-Based Route Protection
  if (user) {
    const rawRole = user.user_metadata?.role;
    const role = rawRole ? String(rawRole).toUpperCase() : 'CUSTOMER';
    const isWorkerPath = request.nextUrl.pathname.startsWith('/worker');
    const isCustomerPath = request.nextUrl.pathname.startsWith('/customer');

    if (role === 'CUSTOMER' && isWorkerPath) {
      const url = request.nextUrl.clone();
      url.pathname = '/customer/dashboard';
      const redirectResponse = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
      return redirectResponse;
    }

    if (role === 'WORKER' && isCustomerPath) {
      const url = request.nextUrl.clone();
      url.pathname = '/worker/dashboard';
      const redirectResponse = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
      return redirectResponse;
    }
  }

  return supabaseResponse;
};
