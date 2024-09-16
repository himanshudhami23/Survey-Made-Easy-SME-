import { NextResponse } from 'next/server';
import { getSFDCConnection } from '../../../util/session';

export async function GET() {
  const conn = await getSFDCConnection();
  
  if (!conn) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const userInfo = await conn.identity();
    return NextResponse.json({
      username: userInfo.username,
      // Add any other user info you want to include
    });
  } catch (error) {
    console.error('Error fetching Salesforce user info:', error);
    return NextResponse.json({ error: 'Failed to fetch user info' }, { status: 500 });
  }
}