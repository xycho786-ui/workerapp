import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const rawRole = user.user_metadata?.role;
  const role = rawRole ? String(rawRole).toUpperCase() : 'CUSTOMER';

  if (role === 'WORKER') {
    redirect("/worker/dashboard");
  } else {
    redirect("/customer/dashboard");
  }
}
