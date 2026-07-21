import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = async () => {
  const cookieStore = await cookies();
  
  const client = createServerClient(
    supabaseUrl!,
    supabaseKey!,
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
      const authCookie = allCookies.find(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));
      if (authCookie && authCookie.value) {
        const parsed = JSON.parse(authCookie.value);
        let accessToken = "";
        if (Array.isArray(parsed)) {
          accessToken = parsed[0];
        } else if (parsed && typeof parsed === 'object') {
          accessToken = parsed.access_token;
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
                    user_metadata: payload.user_metadata || {},
                    app_metadata: payload.app_metadata || { provider: 'email', providers: ['email'] },
                  }
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

    return originalGetUser(jwt);
  };

  return client;
};
