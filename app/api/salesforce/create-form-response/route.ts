import { NextResponse } from 'next/server';
import { getSFDCConnection } from '@/app/util/session';
import { getSalesforceRecordByFormId } from '@/app/util/salesforceApi';

export async function POST(req: Request) {
  const conn = await getSFDCConnection();
  if (!conn) {
    console.error('Salesforce connection failed');
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { formId, formData } = await req.json();

  try {
    // Get the Salesforce Form record
    const formRecord = await getSalesforceRecordByFormId('SME_Form__c', parseInt(formId));

    if (!formRecord) {
      return NextResponse.json({ error: 'Form not found in Salesforce' }, { status: 404 });
    }

    // Create the form response record
    const result = await conn.sobject('SME_Form_Response__c').create({
      Form_Name__c: formRecord.Id,
      Response_Data__c: JSON.stringify(formData),
    });
    console.log('Result create-form-response: ', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating form response record:', error);
    return NextResponse.json({ error: 'Failed to create form response record' }, { status: 500 });
  }
}


// import { NextResponse } from 'next/server';
// import { getSFDCConnection } from '../../../util/session';
// import { getSalesforceRecordByFormId } from '../../../util/salesforceApi';

// export async function POST(req: Request) {
//   const conn = await getSFDCConnection();
//   if (!conn) {
//     console.error('Salesforce connection failed');
//     return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
//   }

//   const { formId, response } = await req.json();

//   try {
//     // Get the Salesforce Form record
//     const formRecord = await getSalesforceRecordByFormId('SME_Form__c', parseInt(formId));

//     if (!formRecord) {
//       return NextResponse.json({ error: 'Form not found in Salesforce' }, { status: 404 });
//     }

//     // Create the form response record
//     const result = await conn.sobject('SME_Form_Response__c').create({
//       Form_Name__c: formRecord.Id,
//       Response_Data__c: JSON.stringify(response),
//     });

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error('Error creating form response record:', error);
//     return NextResponse.json({ error: 'Failed to create form response record' }, { status: 500 });
//   }
// }