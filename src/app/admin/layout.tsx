import { ThemeProvider } from '@/components/ux/theme-provider';
import { getUser } from '@/lib/auth-session';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { ourFileRouter } from '../api/uploadthing/core';
import { UserProvider } from '@/context/UserContext';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { Toaster } from 'sonner';
import Header from '@/components/Admin/Header';
import { extractRouterConfig } from 'uploadthing/server';
import AppSidebar from '@/components/Admin/AppSidebar';
import Footer from '@/components/Public/Footer';
import { cn } from '@/lib/utils';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (user?.role !== 'ADMIN') {
    return <div>{children}</div>;
  }

  return (
    // <div className="flex flex-col md:justify-between md:container font-inter antialiased">
    //   <DashboardNavbar />
    //   <div className="flex-1">{children}</div>
    // </div>
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
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <div className="flex flex-1 font-inter antialiased">
              <div className={cn("flex flex-1 flex-col gap-12")}>
                <Header />
                <div className="min-h-screen mt-20 ">
                  {children}
                </div>
                <Footer />
              </div>
            </div>
            {/* <div className="flex flex-1 flex-col gap-12 font-inter antialiased">
              <Header />
              <div className="min-h-screen mt-20">
                {children}
              </div>
              <Footer />
            </div> */}
          </SidebarProvider>
          <Toaster />
        </UserProvider>
      </ThemeProvider>
    </>
  );
}
