'use client';

import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
// import ThemeSelector from './ThemeSelector';
import Image from "next/image";

interface HeaderProps {
    menuOpen: boolean;
    toggleMenu: () => void;
    desktopNavbar: React.ReactNode;
    mobileNavbar: React.ReactNode;
    profileAccount: React.ReactNode;
    modeToggle: React.ReactNode;
}

export default function Header({
    menuOpen,
    toggleMenu,
    desktopNavbar,
    mobileNavbar,
    profileAccount,
    modeToggle,
}: HeaderProps) {

    return (
        <header className={`relative h-20`}>
            <div
                className="left-0 right-0 shadow-sm top-0 z-50 bg-white dark:bg-neutral-900 fixed transition-all duration-200 ease-in-out h-20"
            >
                <div className="mx-8 flex justify-between items-center h-full">
                    <Link href="/" className="flex-shrink-0">
                        <Image
                            src="/logo_crhom.jpg"
                            alt="CHROM Logo"
                            width={100}
                            height={100}
                            className="w-auto transition-all duration-200 h-15"
                        />
                    </Link>

                    {desktopNavbar}
                    {mobileNavbar}

                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-550"
                            onClick={toggleMenu}
                            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                        >
                            {menuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
                        </button>
                        {profileAccount}
                        {modeToggle}
                    </div>
                </div>
            </div>
        </header>
    );
}