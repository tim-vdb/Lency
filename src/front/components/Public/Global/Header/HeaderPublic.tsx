'use client';

import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import DesktopNavbar from '@/front/components/Public/Global/Navbar/DesktopNavbar';
import MobileNavbar from '@/front/components/Public/Global/Navbar/MobileNavbar';
import { useState } from 'react';
import { useUser } from '@/front/states/contexts/user.context';
import { usePathname } from 'next/navigation';
import { ToggleDarkMode } from '@/front/components/DarkMode/ToggleDarkMode';
import { NavUser } from '@/front/components/Private/Global/Sidebar/nav-user';
import { SidebarProvider } from '@/front/components/ui/sidebar';
import LencyLogo from '@/front/components/ui/lency-logo';

export default function HeaderPublic() {
  const user = useUser();
  const pathname = usePathname();
  const isDashboard = pathname === '/account';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-0 select-none">
      <div className="fixed left-0 right-0 top-4 z-50 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl shadow-sm border border-neutral-200/60 dark:border-neutral-800 h-14 flex items-center px-5 gap-4">

          {/* Left — Logo */}
          <div className="flex-1 flex items-center">
            <Link href="/" className="shrink-0">
              <LencyLogo className="h-8 w-auto" />
            </Link>
          </div>

          {/* Center — Nav links */}
          <DesktopNavbar />

          {/* Right — Actions */}
          <div className="flex-1 flex items-center justify-end gap-3">
            <ToggleDarkMode />

            {user ? (
              <>
                {!isDashboard && (
                  <Link
                    href="/account"
                    className="hidden md:inline-flex text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Tableau de bord
                  </Link>
                )}
                <SidebarProvider className="w-fit min-h-auto">
                  <NavUser />
                </SidebarProvider>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Se connecter
                </Link>
                <Link
                  href="/sign-up"
                  className="text-sm font-semibold bg-[#EA3D0E] hover:bg-[#d43509] text-white px-4 h-9 rounded-xl inline-flex items-center transition-colors"
                >
                  Rejoindre
                </Link>
              </div>
            )}

            {/* Mobile burger */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {menuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
            </button>
          </div>

          <MobileNavbar user={user} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        </div>
      </div>
    </header>
  );
}
