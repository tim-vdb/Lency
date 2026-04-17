'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

export default function LogOut() {
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
        className="cursor-pointer w-full text-left py-1.5 px-2"
        disabled={isPending}
      >
        {isPending ? 'Déconnexion...' : 'Se déconnecter'}
      </button>
    </form>
  );
}
