import { NextResponse } from 'next/server';
import { testDbConnection } from '@/app/lib/db';

export async function GET() {
  try {
    await testDbConnection();
    return NextResponse.json({ message: 'Database connection is successful!' });
  } catch (error) {
    return NextResponse.json({ message: 'Database connection failed.', error: error.message }, { status: 500 });
  }
}
