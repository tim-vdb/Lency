'use client';

import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import DesktopNavbar from '@/front/components/Public/Global/Navbar/DesktopNavbar';
import MobileNavbar from '@/front/components/Public/Global/Navbar/MobileNavbar';
import { useState } from 'react';
import { useUser } from '@/front/states/contexts/user.context';
import { Button } from '@/front/components/ui/button';
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
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };



  return (
    <header className="relative h-[70px]">
      <div className="left-0 right-0 top-4 z-50 fixed px-6">
        <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-sm h-14 flex items-center px-6 gap-6">
          {/* Logo — far left */}
          <Link href="/" className="shrink-0">
            <LencyLogo className="w-auto h-10" />
          </Link>

          {/* Spacer — pushes nav links to the right */}
          <div className="flex-1" />

          {/* Nav links — right aligned, desktop only */}
          <DesktopNavbar />

          {/* Controls */}
          <div className="flex items-center gap-3">
            <ToggleDarkMode />

            {user ? (
              <>
                {!isDashboard && (
                  <Link
                    href="/account"
                    className="hidden md:inline-flex text-sm font-medium text-black dark:text-white"
                  >
                    Dashboard
                  </Link>
                )}
                <SidebarProvider className="w-fit min-h-auto">
                  <NavUser />
                </SidebarProvider>
              </>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex text-sm font-semibold text-[#EA3D0E]"
              >
                Se connecter
              </Link>
            )}

            {/* Mobile burger */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={toggleMenu}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {menuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>

          <MobileNavbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} user={user ?? null} />
        </div>
      </div>
    </header>
  );
}
