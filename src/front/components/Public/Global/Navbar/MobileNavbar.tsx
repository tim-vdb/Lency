'use client';

import { cn } from '@/front/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '@/back/generated/prisma_client';

interface MobileNavbarProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  user: User | null;
}

const navLinks = [
  { href: '/community', label: 'Communauté' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/about', label: 'À propos' },
  { href: '/support', label: 'Support' },
  { href: '/blog', label: 'Blog' },
];

export default function MobileNavbar({ menuOpen, setMenuOpen, user }: MobileNavbarProps) {
  const pathname = usePathname();

  if (!menuOpen) return null;

  return (
    <nav className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-neutral-900 shadow-lg rounded-b-2xl overflow-hidden z-50">
      <div className="px-3 py-3 flex flex-col gap-1">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMenuOpen(false)}
            className={cn(
              'block px-4 py-3 rounded-xl text-[15px] font-medium transition-colors',
              pathname === href
                ? 'bg-[#EA3D0E] text-white'
                : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            )}
          >
            {label}
          </Link>
        ))}

        <div className="border-t border-neutral-100 dark:border-neutral-800 mt-2 pt-2">
          {user ? (
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-[15px] font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-[15px] font-semibold text-[#EA3D0E] hover:bg-orange-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
