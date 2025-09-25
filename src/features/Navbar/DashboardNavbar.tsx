"use client";

import { cn } from '@/lib/utils';
import { Folder, Newspaper, UserCog } from 'lucide-react';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

export default function DashboardNavbar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path;
    };

    const linksClasses = {
        base: "flex items-center gap-2 px-3 py-2 w-fit md:w-full rounded-md text-sm font-medium transition-colors font-cooper",
        isActive: "underline decoration-2 decoration-blue-500 dark:decoration-yellow-600 text-black dark:text-white bg-neutral-200 dark:bg-neutral-800",
        notActive: "text-black dark:text-gray-300"
    }

    return (
        <nav className="md:max-w-xs">
            <div className="flex justify-center md:items-start md:justify-start md:flex-col gap-8 w-full h-full pt-4 md:pt-20">
                <Link
                    href="/admin/gallery"
                    className={cn(linksClasses.base, isActive("/dashboard/gallery")
                        ? linksClasses.isActive
                        : linksClasses.notActive
                    )}
                >
                    <Folder className="text-[oklch(54.6%_.245_262.881)] fill-[oklch(54.6%_.245_262.881)] dark:text-[oklch(68.1%_0.162_75.834))] dark:fill-[oklch(68.1%_0.162_75.834))]" />
                    <p className='hidden md:block'>Galerie</p>
                </Link>
                <Link
                    href="/admin/events"
                    className={cn(linksClasses.base, isActive("/admin/events")
                        ? linksClasses.isActive
                        : linksClasses.notActive
                    )}
                >
                    <Newspaper className='text-[oklch(54.6%_.245_262.881)] dark:text-[oklch(68.1%_0.162_75.834))]' />
                    <p className='hidden md:block'>Gérer les événements</p>
                </Link>
                <Link
                    href="/admin/events"
                    className={cn(linksClasses.base, isActive("/admin/events")
                        ? linksClasses.isActive
                        : linksClasses.notActive
                    )}
                >
                    <UserCog className='text-[oklch(54.6%_.245_262.881)] dark:text-[oklch(68.1%_0.162_75.834))]' />
                    <p className='hidden md:block'>Gérer mon compte</p>
                </Link>
            </div>
        </nav >
    )
}
