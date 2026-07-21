import postgres from 'postgres';
import 'dotenv/config';

async function main() {
  const sql = postgres(process.env.DATABASE_URL as string);
  try {
    const email = 'anfasmohammed001@gmail.com';
    const email2 = 'xycho786@gmail.com';
    
    console.log('Attempting to delete users from auth.users...');
    const result = await sql`
      DELETE FROM auth.users 
      WHERE email IN (${email}, ${email2}) 
         OR email LIKE ${'%' + email} 
         OR email LIKE ${'%' + email2} 
      RETURNING email
    `;
    
    console.log('Deleted from auth.users:', result);
    
    console.log('Attempting to delete users from public."User"...');
    const publicResult = await sql`DELETE FROM public."User" WHERE email IN (${email}, ${email2}) RETURNING email`;
    
    console.log('Deleted from public.User:', publicResult);
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sql.end();
  }
}

main();
