import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LandingPageClient from "./LandingPageClient";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const rawRole = user.user_metadata?.role;
  const role = rawRole ? String(rawRole).toUpperCase() : 'CUSTOMER';
  const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  let roles: string[] = user.user_metadata?.roles || [];
  
  if (roles.length === 0) {
    // Fallback: query database for roles if metadata doesn't have it
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
      try {
        const postgres = (await import('postgres')).default;
        const sql = postgres(connectionString);
        const dbUsers = await sql`
          SELECT u.role, wp."userType" 
          FROM "User" u
          LEFT JOIN "WorkerProfile" wp ON u.id = wp."userId"
          WHERE u.id = ${user.id}
        `;
        await sql.end();
        
        if (dbUsers.length > 0) {
          const dbUser = dbUsers[0];
          const dbRolesSet = new Set<string>();
          if (dbUser.role === 'CUSTOMER') {
            dbRolesSet.add('customer');
          } else if (dbUser.role === 'WORKER') {
            dbRolesSet.add('worker');
            dbRolesSet.add('customer'); // All workers are allowed to act as customers
            if (dbUser.userType === 'freelancer') {
              dbRolesSet.add('freelancer');
            } else if (dbUser.userType === 'business') {
              dbRolesSet.add('business');
            }
          }
          roles = Array.from(dbRolesSet);
        }
      } catch (err) {
        console.error("Error fetching fallback roles from DB in page.tsx:", err);
      }
    }
  }

  if (roles.length === 0) {
    roles = [role.toLowerCase()];
  }

  return <LandingPageClient user={{ name, email: user.email, role, roles }} />;
}
