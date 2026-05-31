import { NextResponse } from 'next/server';
import postgres from 'postgres';

export async function GET() {
  return NextResponse.json({ status: 'API is reachable' });
}

export async function POST(request: Request) {
  console.log('API /api/auth/sync: Received POST request');
  
  // Use direct postgres client to bypass Prisma client-constructor bugs completely
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return NextResponse.json({ message: 'Database connection string missing' }, { status: 500 });
  }
  
  const sql = postgres(connectionString);

  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error('API /api/auth/sync: Failed to parse request JSON', e);
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    
    console.log('API /api/auth/sync: Request body:', JSON.stringify(body));
    const { id, email, name, phone, role, profession, customProfession } = body;

    if (!id || !email || !name) {
      console.warn('API /api/auth/sync: Missing required fields');
      return NextResponse.json(
        { message: 'Missing required fields: id, email, and name are required' },
        { status: 400 }
      );
    }

    console.log('API /api/auth/sync: Syncing user', id);
    
    const userRole = role || 'CUSTOMER';
    const userPhone = phone || null;

    // First, check if user exists by email
    const existingUsers = await sql`SELECT id FROM "User" WHERE email = ${email}`;
    
    let userRecord;

    if (existingUsers.length > 0) {
      console.log('API /api/auth/sync: User found by email, updating details');
      // Intentionally omitting role update to prevent accidental role downgrades on login
      // The role should only be set on initial signup
      const updated = await sql`
        UPDATE "User" 
        SET id = ${id}, name = ${name}, phone = COALESCE(${userPhone}, phone), "updatedAt" = NOW()
        WHERE email = ${email}
        RETURNING *
      `;
      userRecord = updated[0];
    } else {
      console.log('API /api/auth/sync: User not found, creating new user');
      const inserted = await sql`
        INSERT INTO "User" (id, email, name, phone, role, "updatedAt")
        VALUES (${id}, ${email}, ${name}, ${userPhone}, CAST(${userRole} AS "Role"), NOW())
        RETURNING *
      `;
      userRecord = inserted[0];
    }

    // If role is WORKER, ensure worker profile exists
    if (userRecord.role === 'WORKER') {
      console.log('API /api/auth/sync: Ensuring worker profile for', userRecord.id);
      
      let categoryId = null;
      // Get primary profession from the array for category assignment
      const professionList = Array.isArray(profession) ? profession : (profession ? [profession] : []);
      const primaryProfession = professionList.find(p => p !== 'Others');

      if (primaryProfession) {
        const matchingCategories = await sql`SELECT id FROM "Category" WHERE name = ${primaryProfession}`;
        if (matchingCategories.length > 0) {
          categoryId = matchingCategories[0].id;
        } else {
          // Create the category dynamically if it doesn't exist
          const icons: Record<string, string> = {
            'Plumbing': '🔧',
            'Electrical': '⚡',
            'Cleaning': '✨',
            'AC Repair': '💨',
            'Painting': '🎨',
            'Carpentry': '🔨',
            'Pest Control': '🐜',
            'Salon': '✂️',
          };
          const icon = icons[primaryProfession] || '🛠️';
          const newCategory = await sql`
            INSERT INTO "Category" (id, name, icon, description)
            VALUES (gen_random_uuid(), ${primaryProfession}, ${icon}, ${primaryProfession + ' Services'})
            RETURNING id
          `;
          if (newCategory.length > 0) {
            categoryId = newCategory[0].id;
          }
        }
      }

      // Add all selected professions (excluding 'Others') to the skills array
      // If "Others" is selected, append the customProfession value
      let skillsArray = professionList.filter(p => p !== 'Others');
      if (professionList.includes('Others') && customProfession) {
        skillsArray.push(customProfession);
      }

      await sql`
        INSERT INTO "WorkerProfile" (
          id, "userId", skills, experience, "isOnline", rating, "totalReviews", 
          "userType", "profession", "customProfession", "categoryId", "updatedAt"
        )
        VALUES (
          gen_random_uuid(), ${userRecord.id}, ${skillsArray}::text[], 0, false, 0.0, 0, 
          'worker', ${professionList}::text[], ${customProfession || ''}, ${categoryId}, NOW()
        )
        ON CONFLICT ("userId") DO UPDATE
        SET 
          "userType" = 'worker',
          "skills" = COALESCE(${skillsArray}::text[], "WorkerProfile"."skills"),
          "profession" = COALESCE(${professionList}::text[], "WorkerProfile"."profession"),
          "customProfession" = COALESCE(${customProfession || ''}, "WorkerProfile"."customProfession"),
          "categoryId" = COALESCE(${categoryId}, "WorkerProfile"."categoryId"),
          "updatedAt" = NOW()
      `;
    }

    console.log('API /api/auth/sync: Success');
    return NextResponse.json({ user: userRecord }, { status: 201 });
  } catch (error: any) {
    console.error('API /api/auth/sync: CRITICAL ERROR:', error);
    
    // Check for unique constraint violation in Postgres (code 23505)
    if (error.code === '23505') {
      return NextResponse.json(
        { 
          message: `Account synchronization failed: The phone number or email is already registered to another account.`,
          code: error.code 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        message: error.message ? `Database Error: ${error.message}` : 'Internal server error during user synchronization', 
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    // Close the connection
    await sql.end();
  }
}
