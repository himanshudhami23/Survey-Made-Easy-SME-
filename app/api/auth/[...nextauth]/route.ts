import NextAuth from "next-auth";
import { cookies } from 'next/headers';
import { authOptions } from "./authOptions";

const handler = async (req: Request, res: Response) => {
  const cookieStore = cookies();
  const clientId = cookieStore.get('salesforce_client_id')?.value;
  const clientSecret = cookieStore.get('salesforce_client_secret')?.value;

  console.log('Client ID from cookie:', clientId);
  console.log('Client Secret from cookie:', clientSecret ? '[REDACTED]' : 'Not found');

  if (!clientId || !clientSecret) {
    console.error('Missing Salesforce client ID or client secret in cookies');
    return new Response(JSON.stringify({ error: 'Missing Salesforce credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const getauthOptions = authOptions(clientId, clientSecret);
  return NextAuth(getauthOptions)(req, res);
};

export { handler as GET, handler as POST };