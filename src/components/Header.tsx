'use client';
import Logo from './Logo';
// import { NetworkSelector } from './NetworkSelector';
import { DarkModeToggle } from './DarkMode';
import Wallet from './Wallet';
import Nav from './Nav';
import Link from 'next/link';
import { env } from '@/env';
import MobileMenu from './MobileMenu';
import { useMenuProvider } from '@/Providers/MenuProvider';
import { MotionDiv } from './Motion/MotionDiv';
import { useFutureverse } from '@futureverse/react';

export default function Header() {
  const { menuOpen } = useMenuProvider();
  const { userSession } = useFutureverse();

  return (
    <div className="fixed w-full left-0 top-4 z-50 p-4 pt-0 header">
      <div className="flex flex-row relative backdrop-blur-[6px] justify-between items-center p-3 bg-mutedOpacity bg-opacity-60 rounded-lg w-full max-w-screen-xl mx-auto">
        <Link
          href={'/'}
          className="text-sendy flex flex-row gap-1 justify-center items-center "
        >
          <Logo />{' '}
          {env.NEXT_PUBLIC_NETWORK === 'porcini' && (
            <div className="text-[10px] bg-muted rounded-lg inline-flex px-2 py-1 text-slate-300 font-bold tracking-wide">
              PORCINI
            </div>
          )}
        </Link>
        <div className="hidden lg:flex lg:flex-row lg:space-x-4">
          {userSession && <Nav />}
          <Wallet />
          <DarkModeToggle />
        </div>
        <div className="flex flex-row space-x-4 lg:hidden z-50">
          <MobileMenu />
        </div>
        {menuOpen && (
          <MotionDiv
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="block lg:hidden mobile-menu absolute w-full bottom-0 left-0 right-0 pointer-events-none z-50"
          >
            <div className="relative w-full bg-mutedOpacity rounded-lg p-4 mt-4 pointer-events-auto z-10 translate-y-[calc(100%+1rem)] flex flex-col justify-end backdrop-blur-[6px] gap-2 items-end bg-opacity-80 ">
              {userSession && <Nav mobile={true} />}
              <div className="flex flex-row gap-2">
                <Wallet />
                <DarkModeToggle />
              </div>
            </div>
          </MotionDiv>
        )}
      </div>
    </div>
  );
}
