import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LandingPageClient from "./LandingPageClient";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const role = user.user_metadata?.role ? String(user.user_metadata.role).toUpperCase() : 'CUSTOMER';
    
    if (role === 'WORKER') {
      redirect("/customer/jobs");
    }
  }

  redirect("/customer/dashboard");
}
