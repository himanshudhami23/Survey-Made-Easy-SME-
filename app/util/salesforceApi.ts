export async function createSalesforceRecord(objectName: string, fields: any) {
  console.log('Create salesforce Record API');
  
  const response = await fetch('/api/salesforce/create-record', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ objectName, fields }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('Create Record Response: ', data);
  
  return data;
}

export async function deleteSalesforceRecord(objectName: string, id: string) {
  const response = await fetch('/api/salesforce/delete-record', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ objectName, id }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error response from delete-record API:', errorData);
    throw new Error(`Failed to delete Salesforce record: ${errorData.error}`);
  }

  return response.json();
}

export async function updateSalesforceRecord(objectName: string, id: string, fields: any) {
  const response = await fetch('/api/salesforce/update-record', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ objectName, id, fields }),
  });
  return response.json();
}


export async function getSalesforceUserInfo() {
  try {
    const response = await fetch('/api/salesforce/user-info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get Salesforce user info');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getSalesforceUserInfo:', error);
    throw error;
  }
}

export async function getSalesforceRecordByFormId(objectName: string, formId: number) {
    try {
      const response = await fetch('/api/salesforce/get-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objectName: objectName,
          query: {
            fields: ['Id', 'Name', 'Form_Id__c', 'Form_URL__c'],
            where: `Form_Id__c = '${formId}'`
          }
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to get Salesforce record');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in getSalesforceRecordByFormId:', error);
      throw error;
    }
  }


export async function sendResponseToSalesforce(objectName: string, fields: any) {
  try {
    console.log("Client: Sending response to Salesforce", { objectName, fields });
    const response = await fetch('/api/salesforce/create-record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ objectName, fields }),
    });

    console.log("Client: Received response from API", { status: response.status });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Client: Salesforce response received", result);
    return result;
  } catch (error) {
    console.error('Client: Error sending response to Salesforce:', error);
    throw error;
  }
}