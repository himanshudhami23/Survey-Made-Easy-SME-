// 'use server'


// import { getSFDCConnection } from '@/app/util/session';
// import { getSalesforceRecordByFormId } from '@/app/util/salesforceApi';

// export async function submitToSalesforce(formId: string, formData: any) {
//   const conn = await getSFDCConnection();
//   if (!conn) {
//     console.error('Server: Salesforce connection failed');
//     throw new Error('Not authenticated');
//   }

//   console.log('Server: Submitting to Salesforce', { formId, formData });

//   try {
//     // Get the Salesforce Form record
//     const formRecord = await getSalesforceRecordByFormId('SME_Form__c', parseInt(formId));

//     if (!formRecord) {
//       console.error('Server: Form not found in Salesforce', { formId });
//       throw new Error('Form not found in Salesforce');
//     }

//     console.log('Server: Found Salesforce form record', { formRecordId: formRecord.Id });

//     // Create the form response record
//     const result = await conn.sobject('SME_Form_Response__c').create({
//       Form_Name__c: formRecord.Id,
//       Response_Data__c: JSON.stringify(formData),
//     });

//     console.log('Server: Created Salesforce form response record', result);

//     return result;
//   } catch (error) {
//     console.error('Server: Error creating form response record:', error);
//     throw error;
//   }
// }
