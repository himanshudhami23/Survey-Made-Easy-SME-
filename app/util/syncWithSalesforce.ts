// import {deleteSalesforceRecord, getSalesforceRecordByFormId} from './salesforceApi';
// import  prisma  from '@/lib/prisma';

// async function syncWithSalesforce() {
//   try {
//     const localForms = await prisma.form.findMany();

//     for (const localForm of localForms) {
//       const salesforceRecord = await getSalesforceRecordByFormId('Form__c', localForm.id);

//       if (!salesforceRecord) {
//         await prisma.form.delete({ where: { id: localForm.id } });
//         console.log(`Deleted form ${localForm.id} from local app as it no longer exists in Salesforce`);
//       }
//     }

//     console.log('Sync completed successfully');
//   } catch (error) {
//     console.error('Error during sync:', error);
//   }
// }

// // Run the sync function periodically
// setInterval(syncWithSalesforce, 5 * 60 * 1000); // Run every 5 minutes

// // Function to run the sync manually
// export function runManualSync() {
//   return syncWithSalesforce();
// }
