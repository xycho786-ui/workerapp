import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SettingsContent from "./SettingsContent";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      workerProfile: true
    }
  });

  if (!dbUser) {
    redirect("/login");
  }

  const handleLogout = async () => {
    "use server";
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    cookieStore.delete("sb-active-role");

    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <SettingsContent 
      dbUser={dbUser} 
      handleLogoutAction={handleLogout} 
    />
  );
}
