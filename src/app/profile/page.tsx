import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function RootProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const rawRole = user.user_metadata?.role;
    const role = rawRole ? String(rawRole).toUpperCase() : 'CUSTOMER';
    if (role === 'WORKER') {
      redirect("/worker/profile");
    } else {
      redirect("/customer/profile");
    }
  }

  redirect("/");
}
