'use client';

import { SessionProvider } from "next-auth/react";
import { ClerkProvider } from '@clerk/nextjs';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ClerkProvider>{children}</ClerkProvider>
    </SessionProvider>
  );
}