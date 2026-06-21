'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/front/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/front/components/ui/tooltip';
import { cn } from '@/front/lib/utils';
import { usePathname } from 'next/navigation';

type Props = {
  isCollapsed?: boolean;
};

export function ToggleDarkMode({ isCollapsed }: Props) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const isConnected =
    pathname.startsWith('/account') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/community') ||
    pathname.startsWith('/user') ||
    pathname.startsWith('/marketplace');

  const toggleTheme = (e: React.MouseEvent<HTMLDivElement>) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    if (!('startViewTransition' in document)) {
      setTheme(nextTheme);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = (
      document as typeof document & {
        startViewTransition: (cb: () => void) => { ready: Promise<void> };
      }
    ).startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 600,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    });
  };

  return (
    <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            'cursor-pointer ring-0! flex justify-start items-center w-full pl-2 min-h-8 max-h-8 bg-sidebar hover:bg-neutral-150 dark:hover:bg-neutral-950',
            isCollapsed && 'min-w-8 max-w-8',
            !isConnected && 'bg-transparent! border-none! w-fit',
          )}
          suppressHydrationWarning
          asChild
        >
          <div className="flex items-center gap-2" onClick={toggleTheme}>
            <span className="sr-only">Toggle theme</span>
            <Sun className="w-4 h-4 min-h-4 min-w-4 block rotate-0 transition-all dark:hidden dark:-rotate-90" />
            <Moon className="w-4 h-4 min-h-4 min-w-4 hidden rotate-90 transition-all dark:block dark:rotate-0" />
            {isConnected && <span className="items_sidebar">Theme</span>}
          </div>
        </Button>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right">Theme</TooltipContent>
      )}
    </Tooltip>
    </TooltipProvider>
  );
}
