'use client';

import { cn } from '@/front/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import LencyLogo from '@/front/components/ui/lency-logo';

const LINK_CLASS = "text-[15px] sm:text-[16px] text-neutral-800 dark:text-neutral-300 hover:text-[#EA3D0E] dark:hover:text-[#EA3D0E] transition-colors";

const LEGAL_LINKS = [
  { label: "Conditions d'utilisation", href: '#' },
  { label: 'Politique de confidentialité', href: '#' },
  { label: 'Politique de cookies', href: '#' },
  { label: 'Mentions légales', href: '/mentions-legales' },
];

const APP_LINKS = [
  { label: 'Communauté', href: '/community' },
  { label: 'Projets', href: '/marketplace' },
];

const COMPANY_LINKS = [
  { label: 'À propos', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Support', href: '/support' },
  { label: 'Guide utilisateur', href: '/guide-utilisateur' },
];

export default function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <footer className={cn('bg-white dark:bg-neutral-900 py-12 border-t border-neutral-100 dark:border-neutral-800', isAdmin ? 'px-4' : 'px-4 sm:px-6 md:px-12 lg:px-20')}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <FooterColumn links={LEGAL_LINKS} />
        <FooterColumn links={APP_LINKS} />
        <FooterColumn links={COMPANY_LINKS} />

        <div className="flex flex-col items-center gap-3 text-center">
          <LencyLogo className="w-auto h-10" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-[220px]">
            Communauté audiovisuelle pour apprendre, collaborer et progresser.
          </p>
          <div className="w-full border-t border-neutral-200 dark:border-neutral-700 mt-1" />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {links.map((link) => (
        <li key={link.label}>
          <Link href={link.href} className={LINK_CLASS}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
