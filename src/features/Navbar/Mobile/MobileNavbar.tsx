"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect } from "react";

interface MobileNavbarProps {
  setIsScrolled: (scrolled: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export default function MobileNavbar({
  setIsScrolled,
  menuOpen,
  setMenuOpen,
}: MobileNavbarProps) {
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setIsScrolled]);

  // isActive doit être défini ici, car il dépend du pathname
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const isActive = (path: string) => pathname === path;

  if (!menuOpen) return null;

  const linksClasses = {
    base: "block px-3 py-2 rounded-md text-base font-medium transition-colors font-cooper",
    isActive: "bg-yellow-550 text-white",
    notActive:
      "text-neutral-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700",
  };

  return (
    <nav className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-neutral-900 shadow-lg font-cooper">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className={cn(
            linksClasses.base,
            isActive("/") ? linksClasses.isActive : linksClasses.notActive
          )}
        >
          Accueil
        </Link>
        <Link
          href="/events"
          onClick={() => setMenuOpen(false)}
          className={cn(
            linksClasses.base,
            isActive("/events") ? linksClasses.isActive : linksClasses.notActive
          )}
        >
          Événements
        </Link>
        <Link
          href="/contact"
          onClick={() => setMenuOpen(false)}
          className={cn(
            linksClasses.base,
            isActive("/contact")
              ? linksClasses.isActive
              : linksClasses.notActive
          )}
        >
          Contact
        </Link>
        <Link
          href="/about"
          onClick={() => setMenuOpen(false)}
          className={cn(
            linksClasses.base,
            isActive("/about") ? linksClasses.isActive : linksClasses.notActive
          )}
        >
          À propos
        </Link>
      </div>
    </nav>
  );
}
