import { UserButton } from '@clerk/nextjs';
import React, { ReactNode } from 'react'
import Logo from '@/components/Logo';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { auth as getClerkSession } from "@clerk/nextjs/server";
import SalesforceUserMenu from '@/components/SalesforceUserMenu';
import { getSFDCConnection } from '@/app/util/session';

async function Layout({ children }: { children: ReactNode }) {
  const nextAuthSession = await getServerSession();
  
  if (!nextAuthSession) {
    redirect("/signin"); // Redirect to Next Auth sign-in page
  }

  const clerkSession = await getClerkSession();

  if (!clerkSession) {
    redirect("/sign-in"); // Redirect to Clerk sign-in page
  }

  // Get Salesforce connection and user info
  const conn = await getSFDCConnection();
  let salesforceUsername = '';

  console.log('Conection in dashboard: ', conn);
  
  
  if (conn) {
    try {
      const userInfo = await conn.identity();
      salesforceUsername = userInfo.username;
    } catch (error) {
      console.error('Error fetching Salesforce user info:', error);
    }
  }

  return (
    <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
      <nav className='flex justify-between items-center border-b border-border h-[60px] px-4 py-2'>
        <Logo />
        <div className='flex gap-4 items-center'>
          <ThemeSwitcher />
          <SalesforceUserMenu initialUsername={salesforceUsername} />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
      <main className="flex w-full flex-grow">{children}</main>
    </div>
  );
}

export default Layout;