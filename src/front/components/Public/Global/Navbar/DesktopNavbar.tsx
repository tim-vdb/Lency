'use client';

import { cn } from '@/front/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/community', label: 'Communauté' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/about', label: 'À propos' },
  { href: '/support', label: 'Support' },
  { href: '/blog', label: 'Blog' },
];

export default function DesktopNavbar() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6 h-full">
      {navLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'text-sm font-medium transition-colors',
            pathname === href
              ? 'text-[#EA3D0E]'
              : 'text-neutral-800 dark:text-gray-300 hover:text-[#EA3D0E]'
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
