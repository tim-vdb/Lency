import type { Metadata } from 'next';
import { Poppins, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/front/components/providers/QueryProvider';
import { NotificationsProvider } from '@/front/states/contexts/notifications.context';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
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
        className={`${poppins.variable} ${geistMono.variable} font-poppins antialiased min-h-screen dark:bg-gray-extra-dark`}
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
