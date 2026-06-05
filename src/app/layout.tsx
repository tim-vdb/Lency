import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/front/components/providers/QueryProvider';
import { NotificationsProvider } from '@/front/states/contexts/notifications.context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Lency',
    template: '%s',
  },
  description: 'Lency — La plateforme créative pour trouver des collaborateurs et partager des ressources.',
  openGraph: {
    siteName: 'Lency',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-inter antialiased min-h-screen dark:bg-gray-extra-dark`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <NotificationsProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </NotificationsProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
