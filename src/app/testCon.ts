import { connection } from "./lib/db/db";

(async () => {
    try {
      const result = await connection`SELECT 1`;
      console.log('Database connection successful:', result);
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  })();
  