import { NextResponse } from 'next/server';
import postgres from 'postgres';
import crypto from 'crypto';

const connectionString = process.env.DATABASE_URL;

// Keep a single persistent connection pool across requests to avoid high connection overhead
const globalForPostgres = global as unknown as { sql: ReturnType<typeof postgres> | null };
const sql = globalForPostgres.sql || (connectionString ? postgres(connectionString, { max: 10 }) : null);
if (process.env.NODE_ENV !== 'production' && connectionString) {
  globalForPostgres.sql = sql;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
};

// Persistent in-memory cache for user sessions to speed up page loads and transitions
const globalForCache = global as unknown as { userCache: Map<string, { user: any; expiresAt: number }> };
const userCache = globalForCache.userCache || new Map<string, { user: any; expiresAt: number }>();
if (process.env.NODE_ENV !== 'production') {
  globalForCache.userCache = userCache;
}
const CACHE_TTL_MS = 10000; // Cache user metadata for 10 seconds to cover batch page-load requests

function parseUserMetadata(meta: any): Record<string, any> {
  let result = meta;
  while (typeof result === 'string') {
    try {
      result = JSON.parse(result);
    } catch (e) {
      result = {};
      break;
    }
  }
  if (!result || typeof result !== 'object') {
    return {};
  }
  const clean: Record<string, any> = {};
  for (const [key, val] of Object.entries(result)) {
    if (isNaN(Number(key))) {
      clean[key] = val;
    }
  }
  return clean;
}

// Helper to generate a dummy JWT token for a user
function generateTokens(userId: string, email: string, userMetadata?: any) {
  const cleanMeta = parseUserMetadata(userMetadata);
  const payload = {
    iss: 'supabase',
    sub: userId,
    email: email,
    exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 7, // 7 days expiration
    role: 'authenticated',
    aud: 'authenticated',
    user_metadata: cleanMeta,
  };
  const header = { alg: 'HS256', typ: 'JWT' };
  const sHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const sPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  // Dummy signature signed with a static string
  const signature = crypto
    .createHmac('sha256', 'supabase-mock-secret')
    .update(`${sHeader}.${sPayload}`)
    .digest('base64url');

  const accessToken = `${sHeader}.${sPayload}.${signature}`;
  const refreshToken = userId; // Use the userId as the refresh token for simplicity

  return {
    access_token: accessToken,
    token_type: 'bearer',
    expires_in: 3600 * 24 * 7,
    refresh_token: refreshToken,
  };
}

// Helper to parse user ID from token
function getUserIdFromToken(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    return payload.sub || null;
  } catch (e) {
    return null;
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

export async function POST(request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.path || [];
  const fullPath = path.join('/');

  if (!sql) {
    return NextResponse.json({ error: 'Database connection not initialized' }, { status: 500, headers: CORS_HEADERS });
  }

  try {
    // 1. Signup
    if (fullPath === 'auth/v1/signup') {
      const body = await request.json();
      const { email, password, options } = body;
      const userMetadata = body.data || options?.data || {};
      let roles: string[] = userMetadata.roles || [];

      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password required' }, { status: 400, headers: CORS_HEADERS });
      }

      // Check if email has prefix (e.g. worker_email or customer_email)
      const cleanEmail = email.replace(/^(worker|customer)_/, '');
      const hasCustomer = roles.includes('customer');
      const hasProvider = roles.includes('worker') || roles.includes('freelancer') || roles.includes('business');
      
      const hashRes = await sql`SELECT crypt(${password}, gen_salt('bf')) as hash`;
      const hashedPassword = hashRes[0].hash;

      let primaryUser: any = null;
      let primaryTokens: any = null;

      // Helper to sync to public.User and WorkerProfile
      const syncToPublic = async (userId: string, targetEmail: string, dbRole: string, userType: string) => {
        // Sync public User
        const inserted = await sql`
          INSERT INTO public."User" (id, email, name, phone, role, "updatedAt")
          VALUES (${userId}, ${cleanEmail}, ${userMetadata.full_name || ''}, ${userMetadata.phone || null}, CAST(${dbRole} AS "Role"), NOW())
          ON CONFLICT (email, role) DO UPDATE
          SET name = ${userMetadata.full_name || ''}, phone = COALESCE(${userMetadata.phone || null}, public."User".phone), "updatedAt" = NOW()
          RETURNING *
        `;
        
        // Sync WorkerProfile if WORKER
        if (dbRole === 'WORKER') {
          // Determine professions and custom professions
          const professions = userMetadata.profession || [];
          const customProfession = userMetadata.customProfession || '';
          
          let categoryId = null;
          const primaryProfession = professions.find((p: string) => p !== 'Others');
          if (primaryProfession) {
            const matchingCategories = await sql`SELECT id FROM public."Category" WHERE name = ${primaryProfession}`;
            if (matchingCategories.length > 0) {
              categoryId = matchingCategories[0].id;
            }
          }

          let skillsArray = professions.filter((p: string) => p !== 'Others');
          if (professions.includes('Others') && customProfession) {
            skillsArray.push(customProfession);
          }

          await sql`
            INSERT INTO public."WorkerProfile" (
              id, "userId", skills, experience, "isOnline", rating, "totalReviews", 
              "userType", "profession", "customProfession", "categoryId", "updatedAt"
            )
            VALUES (
              gen_random_uuid(), ${userId}, ${skillsArray}::text[], 0, false, 0.0, 0, 
              ${userType}, ${professions}::text[], ${customProfession}, ${categoryId}, NOW()
            )
            ON CONFLICT ("userId") DO UPDATE
            SET 
              "userType" = ${userType},
              "skills" = COALESCE(${skillsArray}::text[], public."WorkerProfile"."skills"),
              "profession" = COALESCE(${professions}::text[], public."WorkerProfile"."profession"),
              "customProfession" = COALESCE(${customProfession}, public."WorkerProfile"."customProfession"),
              "categoryId" = COALESCE(${categoryId}, public."WorkerProfile"."categoryId"),
              "updatedAt" = NOW()
          `;
        }
      };

      // Create Customer Account in auth.users
      if (hasCustomer) {
        const customerEmail = `customer_${cleanEmail}`;
        const existing = await sql`SELECT id FROM auth.users WHERE email = ${customerEmail}`;
        
        let userId = existing.length > 0 ? existing[0].id : null;
        if (!userId) {
          const existingPublic = await sql`SELECT id FROM public."User" WHERE email = ${cleanEmail} AND role = 'CUSTOMER'`;
          userId = existingPublic.length > 0 ? existingPublic[0].id : crypto.randomUUID();
        }

        if (existing.length === 0) {
          await sql`
            INSERT INTO auth.users (
              id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, 
              role, aud, created_at, updated_at, email_confirmed_at
            )
            VALUES (
              ${userId}, ${customerEmail}, ${hashedPassword}, 
              '{"provider":"email","providers":["email"]}'::jsonb, 
              ${JSON.stringify({ ...userMetadata, role: 'CUSTOMER' })}::jsonb, 
              'authenticated', 'authenticated', NOW(), NOW(), NOW()
            )
          `;
        }
        await syncToPublic(userId, customerEmail, 'CUSTOMER', 'customer');

        if (email.startsWith('customer_')) {
          primaryTokens = generateTokens(userId, customerEmail);
          primaryUser = {
            id: userId,
            aud: 'authenticated',
            role: 'authenticated',
            email: customerEmail,
            email_confirmed_at: new Date().toISOString(),
            confirmed_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
            app_metadata: { provider: 'email', providers: ['email'] },
            user_metadata: { ...userMetadata, role: 'CUSTOMER' },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        }
      }

      // Create Worker Account in auth.users
      if (hasProvider) {
        const workerEmail = `worker_${cleanEmail}`;
        const existing = await sql`SELECT id FROM auth.users WHERE email = ${workerEmail}`;
        
        let userId = existing.length > 0 ? existing[0].id : null;
        if (!userId) {
          const existingPublic = await sql`SELECT id FROM public."User" WHERE email = ${cleanEmail} AND role = 'WORKER'`;
          userId = existingPublic.length > 0 ? existingPublic[0].id : crypto.randomUUID();
        }

        const primaryUserType = roles.includes('freelancer') ? 'freelancer' : roles.includes('business') ? 'business' : 'worker';

        if (existing.length === 0) {
          await sql`
            INSERT INTO auth.users (
              id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, 
              role, aud, created_at, updated_at, email_confirmed_at
            )
            VALUES (
              ${userId}, ${workerEmail}, ${hashedPassword}, 
              '{"provider":"email","providers":["email"]}'::jsonb, 
              ${JSON.stringify({ ...userMetadata, role: 'WORKER' })}::jsonb, 
              'authenticated', 'authenticated', NOW(), NOW(), NOW()
            )
          `;
        }
        await syncToPublic(userId, workerEmail, 'WORKER', primaryUserType);

        if (email.startsWith('worker_') || !primaryUser) {
          primaryTokens = generateTokens(userId, workerEmail);
          primaryUser = {
            id: userId,
            aud: 'authenticated',
            role: 'authenticated',
            email: workerEmail,
            email_confirmed_at: new Date().toISOString(),
            confirmed_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
            app_metadata: { provider: 'email', providers: ['email'] },
            user_metadata: { ...userMetadata, role: 'WORKER' },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        }
      }

      return NextResponse.json({ ...primaryTokens, user: primaryUser }, { status: 200, headers: CORS_HEADERS });
    }

    // 2. Token (Login or Refresh)
    if (fullPath === 'auth/v1/token') {
      const url = new URL(request.url);
      const body = await request.json();
      const grantType = url.searchParams.get('grant_type') || body.grant_type;

      if (grantType === 'password') {
        const { email, password } = body;
        if (!email || !password) {
          return NextResponse.json({ error: 'Email and password required' }, { status: 400, headers: CORS_HEADERS });
        }

        // Query the user
        let users = await sql`SELECT * FROM auth.users WHERE email = ${email}`;
        if (users.length === 0) {
          // Fallback: check if the user is in auth.users with worker_ or customer_ prefix
          users = await sql`SELECT * FROM auth.users WHERE email = ${'worker_' + email} OR email = ${'customer_' + email}`;
        }

        if (users.length === 0) {
          // Self-healing: if the user exists in public."User" but not in auth.users, auto-provision
          const cleanEmail = email.replace(/^(worker|customer)_/, '');
          const dbRole = email.startsWith('customer_') ? 'CUSTOMER' : 'WORKER';
          
          const publicUsers = await sql`SELECT id, name, phone FROM public."User" WHERE email = ${cleanEmail} AND role = CAST(${dbRole} AS "Role")`;
          if (publicUsers.length > 0) {
            const publicUser = publicUsers[0];
            const hashRes = await sql`SELECT crypt(${password}, gen_salt('bf')) as hash`;
            const hashedPassword = hashRes[0].hash;
            
            // Reconstruct roles array for metadata
            const allPublicRoles = await sql`SELECT role FROM public."User" WHERE email = ${cleanEmail}`;
            let roles: string[] = allPublicRoles.map(r => r.role.toLowerCase());
            
            const wp = await sql`SELECT "userType" FROM public."WorkerProfile" WHERE "userId" = ${publicUser.id}`;
            if (wp.length > 0 && wp[0].userType) {
              roles.push(wp[0].userType.toLowerCase());
            }
            roles = Array.from(new Set(roles));

            const userMetadata = {
              full_name: publicUser.name || '',
              phone: publicUser.phone || '',
              role: dbRole,
              roles: roles
            };

            const existingAuth = await sql`SELECT id FROM auth.users WHERE id = ${publicUser.id}`;
            if (existingAuth.length > 0) {
              await sql`
                UPDATE auth.users
                SET email = ${email}, encrypted_password = ${hashedPassword}, raw_user_meta_data = ${JSON.stringify(userMetadata)}::jsonb, updated_at = NOW()
                WHERE id = ${publicUser.id}
              `;
            } else {
              await sql`
                INSERT INTO auth.users (
                  id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, 
                  role, aud, created_at, updated_at, email_confirmed_at
                )
                VALUES (
                  ${publicUser.id}, ${email}, ${hashedPassword}, 
                  '{"provider":"email","providers":["email"]}'::jsonb, 
                  ${JSON.stringify(userMetadata)}::jsonb, 
                  'authenticated', 'authenticated', NOW(), NOW(), NOW()
                )
              `;
            }
            
            // Retrieve the newly created user record
            users = await sql`SELECT * FROM auth.users WHERE id = ${publicUser.id}`;
          } else {
            return NextResponse.json({ error: 'invalid_grant', message: 'Invalid login credentials' }, { status: 400, headers: CORS_HEADERS });
          }
        }

        const userRecord = users[0];

        // Verify password
        const verifyRes = await sql`SELECT (crypt(${password}, ${userRecord.encrypted_password}) = ${userRecord.encrypted_password}) as matches`;
        if (!verifyRes[0].matches) {
          return NextResponse.json({ error: 'invalid_grant', message: 'Invalid login credentials' }, { status: 400, headers: CORS_HEADERS });
        }

        // Invalidate user cache on fresh login
        userCache.delete(userRecord.id);

        const cleanMeta = parseUserMetadata(userRecord.raw_user_meta_data);
        const user = {
          id: userRecord.id,
          aud: 'authenticated',
          role: 'authenticated',
          email: userRecord.email,
          email_confirmed_at: userRecord.email_confirmed_at || new Date().toISOString(),
          confirmed_at: userRecord.confirmed_at || new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          app_metadata: userRecord.raw_app_meta_data || { provider: 'email', providers: ['email'] },
          user_metadata: cleanMeta,
          created_at: userRecord.created_at,
          updated_at: userRecord.updated_at,
        };

        const tokens = generateTokens(userRecord.id, userRecord.email, cleanMeta);
        return NextResponse.json({ ...tokens, user }, { status: 200, headers: CORS_HEADERS });
      }

      if (grantType === 'refresh_token') {
        const { refresh_token } = body;
        if (!refresh_token) {
          return NextResponse.json({ error: 'invalid_grant', message: 'Refresh token required' }, { status: 400, headers: CORS_HEADERS });
        }

        // The refresh token is the userId in our mock setup
        const users = await sql`SELECT * FROM auth.users WHERE id = ${refresh_token}`;
        if (users.length === 0) {
          return NextResponse.json({ error: 'invalid_grant', message: 'Invalid Refresh Token: Refresh Token Not Found' }, { status: 400, headers: CORS_HEADERS });
        }

        const userRecord = users[0];
        const cleanMeta = parseUserMetadata(userRecord.raw_user_meta_data);
        const user = {
          id: userRecord.id,
          aud: 'authenticated',
          role: 'authenticated',
          email: userRecord.email,
          email_confirmed_at: userRecord.email_confirmed_at || new Date().toISOString(),
          confirmed_at: userRecord.confirmed_at || new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          app_metadata: userRecord.raw_app_meta_data || { provider: 'email', providers: ['email'] },
          user_metadata: cleanMeta,
          created_at: userRecord.created_at,
          updated_at: userRecord.updated_at,
        };

        const tokens = generateTokens(userRecord.id, userRecord.email, cleanMeta);
        return NextResponse.json({ ...tokens, user }, { status: 200, headers: CORS_HEADERS });
      }

      return NextResponse.json({ error: 'unsupported_grant_type' }, { status: 400, headers: CORS_HEADERS });
    }

    // 3. Logout
    if (fullPath === 'auth/v1/logout') {
      return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: CORS_HEADERS });
  } catch (error: any) {
    console.error('Mock Auth API Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.path || [];
  const fullPath = path.join('/');

  if (!sql) {
    return NextResponse.json({ error: 'Database connection not initialized' }, { status: 500, headers: CORS_HEADERS });
  }

  try {
    if (fullPath === 'auth/v1/user') {
      const authHeader = request.headers.get('Authorization') || '';
      const token = authHeader.replace('Bearer ', '').trim();
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
      }

      const userId = getUserIdFromToken(token);
      if (!userId) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401, headers: CORS_HEADERS });
      }

      const now = Date.now();
      const cached = userCache.get(userId);
      if (cached && cached.expiresAt > now) {
        return NextResponse.json(cached.user, { status: 200, headers: CORS_HEADERS });
      }

      const users = await sql`SELECT * FROM auth.users WHERE id = ${userId}`;
      if (users.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 401, headers: CORS_HEADERS });
      }

      const userRecord = users[0];
      const cleanMeta = parseUserMetadata(userRecord.raw_user_meta_data);
      const user = {
        id: userRecord.id,
        aud: 'authenticated',
        role: 'authenticated',
        email: userRecord.email,
        email_confirmed_at: userRecord.email_confirmed_at || new Date().toISOString(),
        confirmed_at: userRecord.confirmed_at || new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        app_metadata: userRecord.raw_app_meta_data || { provider: 'email', providers: ['email'] },
        user_metadata: cleanMeta,
        created_at: userRecord.created_at,
        updated_at: userRecord.updated_at,
      };

      userCache.set(userId, { user, expiresAt: now + CACHE_TTL_MS });

      return NextResponse.json(user, { status: 200, headers: CORS_HEADERS });
    }

    if (fullPath === 'auth/v1/settings') {
      return NextResponse.json({
        providers: { email: true },
        external: {},
        disable_signup: false,
      }, { status: 200, headers: CORS_HEADERS });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: CORS_HEADERS });
  } catch (error: any) {
    console.error('Mock Auth API GET Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.path || [];
  const fullPath = path.join('/');

  if (!sql) {
    return NextResponse.json({ error: 'Database connection not initialized' }, { status: 500, headers: CORS_HEADERS });
  }

  try {
    if (fullPath === 'auth/v1/user') {
      const authHeader = request.headers.get('Authorization') || '';
      const token = authHeader.replace('Bearer ', '').trim();
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
      }

      const userId = getUserIdFromToken(token);
      if (!userId) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401, headers: CORS_HEADERS });
      }

      const body = await request.json();
      const userMetadataUpdate = body.data || {};

      // Get existing user metadata
      const users = await sql`SELECT raw_user_meta_data FROM auth.users WHERE id = ${userId}`;
      if (users.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 401, headers: CORS_HEADERS });
      }

      const currentMetadata = parseUserMetadata(users[0].raw_user_meta_data);
      const newMetadata = { ...currentMetadata, ...userMetadataUpdate };

      // Update in database
      const updatedUsers = await sql`
        UPDATE auth.users 
        SET raw_user_meta_data = ${JSON.stringify(newMetadata)}::jsonb, updated_at = NOW()
        WHERE id = ${userId}
        RETURNING *
      `;

      const userRecord = updatedUsers[0];
      
      // Invalidate user cache on profile update
      userCache.delete(userId);
      const cleanMeta = parseUserMetadata(userRecord.raw_user_meta_data);
      const user = {
        id: userRecord.id,
        aud: 'authenticated',
        role: 'authenticated',
        email: userRecord.email,
        email_confirmed_at: userRecord.email_confirmed_at || new Date().toISOString(),
        confirmed_at: userRecord.confirmed_at || new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        app_metadata: userRecord.raw_app_meta_data || { provider: 'email', providers: ['email'] },
        user_metadata: cleanMeta,
        created_at: userRecord.created_at,
        updated_at: userRecord.updated_at,
      };

      return NextResponse.json(user, { status: 200, headers: CORS_HEADERS });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: CORS_HEADERS });
  } catch (error: any) {
    console.error('Mock Auth API PUT Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500, headers: CORS_HEADERS });
  }
}
