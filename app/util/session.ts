import { cookies } from 'next/headers';
import { authOptions } from '../api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth/next';
import jsforce from "jsforce";
import { Session } from "next-auth";

interface ExtendedSession extends Session {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  instanceUrl?: string;
}

export const getSFDCConnection = async (): Promise<jsforce.Connection | null> => {
  try {
    const cookieStore = cookies();
    const clientId = cookieStore.get('salesforce_client_id')?.value;
    const clientSecret = cookieStore.get('salesforce_client_secret')?.value;

    if (!clientId || !clientSecret) {
      console.error('Missing Salesforce client ID or client secret in cookies');
      return null;
    }

    const getauthOptions = authOptions(clientId, clientSecret);
    const session = await getServerSession(getauthOptions) as ExtendedSession | null;
    console.log('Initial SFDC Session', session);

    if (!session || !session.accessToken || !session.instanceUrl) {
      console.log('Session is invalid or missing:', session);
      return null;
    }

    let conn = new jsforce.Connection({
      instanceUrl: session.instanceUrl,
      accessToken: session.accessToken,
    });

    // Try to verify the connection
    try {
      await conn.identity();
      console.log('JsForce Connection established');
      return conn;
    } catch (error: any) {
      if (error.errorCode === 'INVALID_SESSION_ID') {
        console.log('Session expired, attempting to refresh...');
        
        // Create a new connection with the refreshed token
        conn = new jsforce.Connection({
          instanceUrl: session.instanceUrl,
          accessToken: session.accessToken,
        });

        // Verify the new connection
        await conn.identity();
        console.log('JsForce Connection established with refreshed token');
        return conn;
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('SFDC Connection Error:', error);
    return null;
  }
};