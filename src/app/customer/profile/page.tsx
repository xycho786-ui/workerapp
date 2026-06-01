import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CustomerProfileContent from "./CustomerProfileContent";

export default async function CustomerProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: {
      bookings: {
        include: {
          worker: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      },
      reviewsGiven: {
        include: {
          worker: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      },
      savedWorkers: {
        include: {
          worker: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!dbUser) {
    redirect("/login");
  }

  const handleLogout = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <CustomerProfileContent 
      dbUser={dbUser} 
      handleLogoutAction={handleLogout} 
    />
  );
}
