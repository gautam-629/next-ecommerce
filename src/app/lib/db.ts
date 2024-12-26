import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(process.env.DATABASE_URL!);
 

export async function testDbConnection() {
    try {
      const result = await db.execute('select 1');
      console.log('Database connection test successful:', result);
    } catch (error) {
      console.error('Database connection test failed:', error);
    }
  }