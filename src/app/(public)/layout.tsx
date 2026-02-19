import { ourFileRouter } from '@/app/api/uploadthing/core';
import { getUser } from '@/back/lib/auth-session';
import Footer from '@/front/components/Public/Footer/Footer';
import Header from '@/front/components/Public/Header/Header';
import { UserProvider } from '@/front/context/UserContext';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { extractRouterConfig } from 'uploadthing/server';
import '../../app/globals.css';

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  title: 'Boilerplate',
  description: 'Boilerplate Next.js 16',
};

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <>
      <NextSSRPlugin
        /**
         * The `extractRouterConfig` will extract **only** the route configs
         * from the router to prevent additional information from being
         * leaked to the client. The data passed to the client is the same
         * as if you were to fetch `/api/uploadthing` directly.
         */
        routerConfig={extractRouterConfig(ourFileRouter)}
      />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <UserProvider user={user}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </UserProvider>
      </ThemeProvider>
    </>
  );
}
