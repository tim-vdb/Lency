"use client"

import { ModeToggle } from '@/features/DarkMode/ModeToggle';
import DesktopNavbar from '@/features/Navbar/Public/Desktop/DesktopNavbar';
import MobileNavbar from '@/features/Navbar/Public/Mobile/MobileNavbar';
import ProfileAccount from '@/features/profile/server/profileAccount';
import Header from '@/widgets/Public/Header'
import React, { useState } from 'react'

export default function PublicHeaderShell() {
    const [menuOpen, setMenuOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isScrolled, setIsScrolled] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    return (
        <Header
            menuOpen={menuOpen}
            toggleMenu={toggleMenu}
            desktopNavbar={<DesktopNavbar />}
            mobileNavbar={<MobileNavbar setIsScrolled={setIsScrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />}
            profileAccount={<ProfileAccount />}
            modeToggle={<ModeToggle />}
        />
    )
}
