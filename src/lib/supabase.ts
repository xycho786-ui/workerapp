import { createBrowserClient } from '@supabase/ssr';

const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (typeof window !== "undefined" && url.includes("/api/supabase-mock")) {
    return `${window.location.origin}/api/supabase-mock`;
  }
  return url;
};

const supabaseUrl = getSupabaseUrl();
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials missing. Check your .env.local file.");
}

const sanitizedUrl = supabaseUrl.trim().replace(/\/$/, "");

export const supabase = createBrowserClient(sanitizedUrl, supabaseKey);
