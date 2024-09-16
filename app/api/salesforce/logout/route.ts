import { NextResponse } from 'next/server';
import { getSFDCConnection } from '@/app/util/session';
import { getServerSession } from "next-auth/next";
import { authOptions } from  "../../auth/[...nextauth]/authOptions";
import axios from "axios";
import qs from "qs";

export async function POST(request: Request) {
  try {
    const { clientId, clientSecret } = await request.json();
    const session = await getServerSession(authOptions(clientId, clientSecret));
    
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const conn = await getSFDCConnection();
    
    if (!conn) {
      return NextResponse.json({ error: 'Salesforce connection not found' }, { status: 401 });
    }

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Client ID and Client Secret are required' }, { status: 400 });
    }

    // Revoke the Salesforce access token
    const revokeTokenResponse = await axios({
      method: 'post',
      url: `https://login.salesforce.com/services/oauth2/revoke`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({
        'token': session.accessToken,
        'client_id': clientId,
        'client_secret': clientSecret
      })
    });

    if (revokeTokenResponse.status !== 200) {
      throw new Error('Failed to revoke Salesforce token');
    }

    // Clear the local session
    // Note: The exact implementation depends on how you're managing sessions
    // This is a placeholder for where you'd clear the session
    // await clearSession();

    // Return a response indicating successful logout and where to redirect
    return NextResponse.json({ 
      message: 'Logged out successfully',
      redirect: '/login' // Your custom login page URL
    });
  } catch (error) {
    console.error('Error logging out from Salesforce:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}