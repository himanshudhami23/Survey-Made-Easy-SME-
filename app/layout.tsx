import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import DesignerContextProvider from "@/components/context/DesignerContext";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "@/components/providers/Authproviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Survey Made Easy",
  description: "Create own Form templates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <NextTopLoader/>
          <DesignerContextProvider> 
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >        
              {children}
              <Toaster/>
            </ThemeProvider>
          </DesignerContextProvider> 
        </Providers>
      </body>
    </html>
  );
}