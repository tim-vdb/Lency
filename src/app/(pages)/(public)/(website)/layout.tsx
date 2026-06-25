import { getUser } from '@/back/lib/auth-session';
import { UserProvider } from '@/front/states/contexts/user.context';
import { ModalRenderer } from '@/front/components/Modals/ModalRenderer';
import Footer from '@/front/components/Public/Global/Footer/Footer';
import HeaderPublic from '@/front/components/Public/Global/Header/HeaderPublic';

export const dynamic = 'force-dynamic';

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <UserProvider user={user}>
      <div className="min-h-screen flex flex-col">
        <HeaderPublic />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <ModalRenderer />
    </UserProvider>
  );
}
