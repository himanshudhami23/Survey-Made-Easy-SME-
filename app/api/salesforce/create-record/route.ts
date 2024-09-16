// app/api/salesforce/create-record/route.ts

import { NextResponse } from 'next/server';
import { getSFDCConnection } from '../../../util/session';

export async function POST(req: Request) {
  const conn = await getSFDCConnection();
  console.log('Coonection in create - record: ', conn);
  
  if (!conn) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { objectName, fields } = await req.json();

  try {
    const result = await conn.sobject(objectName).create(fields);
    console.log('Result create-record: ', result );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating record:', error);
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }
}