import { NextResponse } from 'next/server';
import { getSFDCConnection } from '../../../util/session';

export async function POST(req: Request) {
  const conn = await getSFDCConnection();
  console.log('Connection in get-record: ', conn);
  
  if (!conn) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { objectName, query } = await req.json();

  try {
    const result = await conn.query(`SELECT ${query.fields.join(', ')} FROM ${objectName} WHERE ${query.where}`);
    console.log('Result get-record: ', result);
    
    if (result.records.length > 0) {
      return NextResponse.json(result.records[0]);
    } else {
      return NextResponse.json({ error: 'No record found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error getting record:', error);
    return NextResponse.json({ error: 'Failed to get record' }, { status: 500 });
  }
}