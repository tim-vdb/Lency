import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../app/globals.css";
import { Toaster } from "sonner";
import { getUser } from "@/lib/auth-session";
import { extractRouterConfig } from "uploadthing/server";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ThemeProvider } from "next-themes";
import { UserProvider } from "@/context/UserContext";
import PublicHeaderShell from "@/app/shells/PublicHeaderShell";
import Footer from "@/widgets/Public/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CHROM - Mölkky",
  description: "Club Rhodanien de Mölkky",
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
          <PublicHeaderShell />
          <main className="min-h-screen w-[100vw]">{children}</main>
          <Footer />
          <Toaster />
        </UserProvider>
      </ThemeProvider>
    </>
  );
}
