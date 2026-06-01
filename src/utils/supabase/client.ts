import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = () =>
  createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
    {
      global: {
        fetch: async (url, options) => {
          try {
            return await fetch(url, options);
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
