import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AccountForm from "./AccountForm";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { workerProfile: true }
  });

  if (!dbUser) {
    redirect("/login");
  }

  const isWorker = dbUser.role === "WORKER" || !!dbUser.workerProfile;

  return <AccountForm initialData={dbUser} isWorker={isWorker} />;
}
