import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import WorkerProfileContent from "./WorkerProfileContent";

export default async function WorkerProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: {
      workerProfile: {
        include: {
          jobs: {
            include: {
              customer: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true
                }
              }
            },
            orderBy: {
              createdAt: "desc"
            }
          },
          reviews: {
            include: {
              reviewer: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true
                }
              }
            },
            orderBy: {
              createdAt: "desc"
            }
          }
        }
      }
    }
  });

  if (!dbUser) {
    redirect("/login");
  }

  // Fallback: If user is not yet a worker, redirect them to dashboard/upgrade
  if (!dbUser.workerProfile) {
    redirect("/customer/dashboard");
  }

  const handleLogout = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <WorkerProfileContent 
      dbUser={dbUser} 
      handleLogoutAction={handleLogout} 
    />
  );
}
