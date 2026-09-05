import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const getSupabaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  if (url.includes("/api/supabase-mock")) {
    const port = process.env.PORT || "3002";
    return `http://localhost:${port}/api/supabase-mock`;
  }
  return url;
};

const supabaseUrl = getSupabaseUrl();
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

export const createClient = async () => {
  const cookieStore = await cookies();
  
  const client = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );

  // Override auth.getUser() to decode the JWT locally from cookies
  // This eliminates slow self-referential loopback HTTP requests (fetching localhost:3000 on itself)
  const originalGetUser = client.auth.getUser.bind(client.auth);
  client.auth.getUser = async (jwt?: string) => {
    try {
      const allCookies = cookieStore.getAll();
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
                data: {
                  user: {
                    id: payload.sub,
                    email: payload.email,
                    role: 'authenticated',
                    aud: 'authenticated',
                    created_at: new Date().toISOString(),
                    user_metadata: payload.user_metadata || {},
                    app_metadata: payload.app_metadata || { provider: 'email', providers: ['email'] },
                  } as any
                },
                error: null
              };
            }
          }
        }
      }
    } catch (e) {
      console.warn("Failed to locally decode Supabase session token, falling back:", e);
    }

    try {
      return await originalGetUser(jwt);
    } catch (e) {
      return { data: { user: null }, error: null };
    }
  };

  return client;
};
