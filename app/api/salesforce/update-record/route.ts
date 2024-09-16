import { NextResponse } from 'next/server';
import { getSFDCConnection } from '../../../util/session';

export async function POST(req: Request) {
  const conn = await getSFDCConnection();
  if (!conn) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { objectName, id, fields } = await req.json();

  try {
    const result = await conn.sobject(objectName).update({ Id: id, ...fields });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating record:', error);
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}