import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const role = user.user_metadata?.role ? String(user.user_metadata.role).toUpperCase() : 'CUSTOMER';
      if (role === 'WORKER') {
        redirect("/customer/jobs");
      }
    }
  } catch (e) {
    // Fallthrough to customer dashboard if auth check throws
  }

  redirect("/customer/dashboard");
}
