import type { Metadata } from "next";
import { Providers } from './providers';
import { Inter } from 'next/font/google';
import './globals.css';
import { UserProvider } from "@auth0/nextjs-auth0/client";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Profile App',
  description: 'Generate members profile',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;  
}>) {
  return (
    <html lang='en'>
      <body>
        <Providers>
        <UserProvider>
            {children}
        </UserProvider>
        </Providers>
      </body>
    </html>
  );
}