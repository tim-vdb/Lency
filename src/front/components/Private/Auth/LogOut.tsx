'use client';

import { cn } from '@/front/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { signOut } from '@/back/lib/auth-client';

export default function LogOut({ className }: { className?: string }) {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const { error } = await signOut();
        if (error) {
          toast.error(error.message || 'Erreur lors de la déconnexion');
          return;
        }
        pathname.startsWith("/account") || pathname.startsWith("/admin") ? router.push("/login") : router.push("/");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Erreur lors de la déconnexion');
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
