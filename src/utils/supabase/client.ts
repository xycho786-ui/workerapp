import { createBrowserClient } from "@supabase/ssr";

const getSupabaseUrl = () => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("/api/supabase-mock")) {
    return `${window.location.origin}/api/supabase-mock`;
  }
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
};

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = () =>
  createBrowserClient(
    getSupabaseUrl()!,
    supabaseKey!,
    {
      global: {
        fetch: async (url, options) => {
          try {
            const response = await fetch(url, options);

            // Check if the request is to the token refresh endpoint and returns 400
            const urlString = typeof url === 'string' ? url : url instanceof URL ? url.toString() : '';
            if (urlString.includes('/auth/v1/token') && response.status === 400) {
              const clone = response.clone();
              try {
                const data = await clone.json();
                const errorStr = (data.error || '').toLowerCase();
                const errorDesc = (data.error_description || '').toLowerCase();
                const messageStr = (data.message || '').toLowerCase();
                if (
                  data && 
                  (errorStr === 'invalid_grant' || 
                   errorStr.includes('refresh_token') ||
                   errorDesc.includes('refresh_token') ||
                   messageStr.includes('refresh token') ||
                   messageStr.includes('refresh_token'))
                ) {
                  console.warn("Invalid refresh token detected. Clearing session cookies and localStorage.");
                  if (typeof window !== "undefined") {
                    // Clear all local storage keys starting with 'sb-'
                    Object.keys(localStorage).forEach((key) => {
                      if (key.startsWith("sb-")) {
                        localStorage.removeItem(key);
                      }
                    });
                    // Clear all cookies starting with 'sb-'
                    document.cookie.split(";").forEach((cookie) => {
                      const eqPos = cookie.indexOf("=");
                      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
                      if (name.startsWith("sb-")) {
                        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                      }
                    });
                  }
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
            return response;
          } catch (error) {
            console.warn("Supabase network request failed:", error);
            // Return a 502 response to prevent unhandled promise rejections 
            // that cause the Next.js error overlay to pop up for network failures.
            return new Response(JSON.stringify({ error: "Network error" }), {
              status: 502,
              headers: { "Content-Type": "application/json" }
            });
          }
        }
      }
    }
  );
