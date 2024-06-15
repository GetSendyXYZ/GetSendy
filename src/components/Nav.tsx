'use client';
import React from 'react';
import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { env } from '@/env';
import { useMenuProvider } from '@/Providers/MenuProvider';

const navItems = [
  {
    title: 'App',
    href: '/app',
    visible: true,
    comingSoon: false,
  },
  {
    title: 'Bulk Send',
    href: '/sendy',
    visible: true,
    comingSoon: false,
  },
  {
    title: 'Incinerate',
    href: '/incinerate',
    visible: env.NEXT_PUBLIC_NETWORK === 'porcini',
    comingSoon: false,
  },
  {
    title: 'Airdrop',
    href: '/airdrop',
    visible: true,
    comingSoon: true,
  },
] as const;

export default function Nav({ mobile = false }) {
  const { setMenuOpen } = useMenuProvider();

  return (
    <NavigationMenu>
      <NavigationMenuList
        className={`flex ${mobile ? 'flex-col items-end mb-4' : 'flex-row'}  gap-4 text-primary dark:text-sendy text-opacity-80 mr-2`}
      >
        {navItems
          .filter(i => i.visible)
          .map(item => (
            <NavigationMenuItem key={item.title}>
              <Link
                href={item.href}
                legacyBehavior
                passHref
                onClick={() => setMenuOpen(false)}
              >
                <NavigationMenuLink
                  className={`uppercase ${mobile ? 'text-lg' : 'text-xs'} ${item.comingSoon ? 'cursor-not-allowed opacity-20' : 'hover:opacity-40'} tracking-wider  transition-all duration-300 font-bold `}
                  onClick={e => {
                    if (!item.comingSoon) {
                      setMenuOpen(false);
                    } else {
                      e.preventDefault();
                      setMenuOpen(false);
                    }
                  }}
                >
                  {item.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
