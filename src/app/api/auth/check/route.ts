import { NextResponse } from 'next/server';
import postgres from 'postgres';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return NextResponse.json({ message: 'Database connection string missing' }, { status: 500 });
  }

  const sql = postgres(connectionString);

  try {
    // 1. First, check auth.users metadata for the list of roles
    const authUsers = await sql`
      SELECT raw_user_meta_data->'roles' as roles
      FROM auth.users
      WHERE email = ${email} OR email LIKE ${'%' + email}
    `;

    let allRoles: string[] = [];
    authUsers.forEach(u => {
      if (Array.isArray(u.roles)) {
        allRoles.push(...u.roles);
      } else if (u.roles && typeof u.roles === 'string') {
        try {
          const parsed = JSON.parse(u.roles);
          if (Array.isArray(parsed)) {
            allRoles.push(...parsed);
          }
        } catch (e) {}
      }
    });

    let accounts: { role: string; userType: string | null }[] = [];
    if (allRoles.length > 0) {
      // Deduplicate
      allRoles = Array.from(new Set(allRoles.map(r => r.toLowerCase())));
      
      accounts = allRoles.map(roleLower => {
        if (roleLower === 'customer') {
          return { role: 'CUSTOMER', userType: 'customer' };
        } else if (roleLower === 'worker') {
          return { role: 'WORKER', userType: 'worker' };
        } else if (roleLower === 'freelancer') {
          return { role: 'WORKER', userType: 'freelancer' };
        } else if (roleLower === 'business' || roleLower === 'small_business') {
          return { role: 'WORKER', userType: 'business' };
        } else {
          return { role: 'WORKER', userType: roleLower };
        }
      });
    }

    // 2. Fallback to database tables for legacy users
    if (accounts.length === 0) {
      const users = await sql`
        SELECT u.role, wp."userType" 
        FROM "User" u
        LEFT JOIN "WorkerProfile" wp ON u.id = wp."userId"
        WHERE u.email = ${email}
      `;
      accounts = users.map(u => ({
        role: u.role,
        userType: u.userType || null
      }));
    }

    const roles = Array.from(new Set(accounts.map(acc => acc.role)));
    
    return NextResponse.json({ roles, accounts }, { status: 200 });
  } catch (error: any) {
    console.error('API /api/auth/check: Error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  } finally {
    await sql.end();
  }
}
