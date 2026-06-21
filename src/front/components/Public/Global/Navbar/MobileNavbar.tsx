'use client';

import { cn } from '@/front/lib/utils';
import Link from 'next/link';

interface MobileNavbarProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export default function MobileNavbar({
  menuOpen,
  setMenuOpen,
}: MobileNavbarProps) {
  // isActive doit être défini ici, car il dépend du pathname
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : '';
  const isActive = (path: string) => pathname === path;

  if (!menuOpen) return null;

  const linksClasses = {
    base: 'block px-3 py-2 rounded-md text-base font-medium transition-colors font-cooper',
    isActive: 'bg-yellow-550 text-white',
    notActive:
      'text-neutral-900 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700',
  };

  return (
    <nav className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-neutral-900 shadow-lg font-cooper">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <Link
          href="/features"
          onClick={() => setMenuOpen(false)}
          className={cn(
            linksClasses.base,
            isActive('/features')
              ? linksClasses.isActive
              : linksClasses.notActive
          )}
        >
          Features
        </Link>
        <Link
          href="/solution"
          onClick={() => setMenuOpen(false)}
          className={cn(
            linksClasses.base,
            isActive('/solution')
              ? linksClasses.isActive
              : linksClasses.notActive
          )}
        >
          Solution
        </Link>
        <Link
          href="/pricing"
          onClick={() => setMenuOpen(false)}
          className={cn(
            linksClasses.base,
            isActive('/pricing')
              ? linksClasses.isActive
              : linksClasses.notActive
          )}
        >
          Tarifs
        </Link>
        <Link
          href="/about"
          onClick={() => setMenuOpen(false)}
          className={cn(
            linksClasses.base,
            isActive('/about') ? linksClasses.isActive : linksClasses.notActive
          )}
        >
          À propos
        </Link>
        <Link
          href="/contact"
          onClick={() => setMenuOpen(false)}
          className={cn(
            linksClasses.base,
            isActive('/contact')
              ? linksClasses.isActive
              : linksClasses.notActive
          )}
        >
          Contact
        </Link>
        <Link
          href="/team"
          onClick={() => setMenuOpen(false)}
          className={cn(
            linksClasses.base,
            isActive('/team') ? linksClasses.isActive : linksClasses.notActive
          )}
        >
          Équipe
        </Link>
        <Link
          href="/docs"
          onClick={() => setMenuOpen(false)}
          className={cn(
            linksClasses.base,
            isActive('/docs') ? linksClasses.isActive : linksClasses.notActive
          )}
        >
          Documentation
        </Link>
        <Link
          href="/blog"
          onClick={() => setMenuOpen(false)}
          className={cn(
            linksClasses.base,
            isActive('/blog') ? linksClasses.isActive : linksClasses.notActive
          )}
        >
          Blog
        </Link>
      </div>
    </nav>
  );
}
