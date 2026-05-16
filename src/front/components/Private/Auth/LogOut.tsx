'use client';

import { cn } from '@/front/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

export default function LogOut({ className }: { className?: string }) {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await fetch('/api/auth/sign-out', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
          credentials: 'include',
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          toast.error(data?.message || 'Erreur lors de la déconnexion');
          return;
        }

        pathname.startsWith("/account") ? router.push("/login") : router.push("/")

        router.refresh();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur lors de la déconnexion';
        toast.error(message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        className={cn("cursor-pointer w-full text-left py-1.5", className)}
        disabled={isPending}
      >
        {isPending ? 'Déconnexion...' : 'Se déconnecter'}
      </button>
    </form>
  );
}
