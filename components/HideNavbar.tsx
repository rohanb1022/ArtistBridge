'use client';

import { Navbar } from '@/components/Navbar';
import { usePathname } from 'next/navigation';

const HideNavbar = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const hideNavbarRoutes = [
    '/auth/organizer/login',
    '/auth/organizer/signup',
    '/auth/artist/login',
    '/auth/artist/signup',
  ];

  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar/>}
      {children}
    </>
  );
};

export default HideNavbar;
