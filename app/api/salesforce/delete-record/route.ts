import { NextResponse } from 'next/server';
import { getSFDCConnection } from '../../../util/session';

export async function POST(req: Request) {
  const conn = await getSFDCConnection();
  if (!conn) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { objectName, id } = await req.json();

  try {
    // First, check if the record exists
    const record = await conn.sobject(objectName).retrieve(id);
    
    if (!record) {
      console.log(`Record with ID ${id} not found in Salesforce`);
      return NextResponse.json({ success: false, error: 'Record not found' });
    }

    // If the record exists, attempt to delete it
    const result = await conn.sobject(objectName).delete(id);
    console.log('Salesforce delete result:', result);
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, errors: result.errors });
    }
  } catch (error) {
    console.error('Error deleting record:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete record: ' + error }, { status: 500 });
  }
}







// import { NextResponse } from 'next/server';
// import { getSFDCConnection } from '../../../util/session';

// export async function POST(req: Request) {
//   const conn = await getSFDCConnection();
//   if (!conn) {
//     return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
//   }

//   const { objectName, id } = await req.json();

//   try {
//     const result = await conn.sobject(objectName).delete(id);
//     console.log('delete record result: ', result);
    
//     return NextResponse.json(result);
//   } catch (error) {
//     console.error('Error deleting record:', error);
//     return NextResponse.json({ error: 'Failed to delete record: ' + error }, { status: 500 });
//   }
// }