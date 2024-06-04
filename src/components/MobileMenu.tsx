'use client';

import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useMenuProvider } from '@/Providers/MenuProvider';

export default function MobileMenu() {
  const { menuOpen, setMenuOpen } = useMenuProvider();

  return (
    <div className="relative">
      <Button
        variant="default"
        size="icon"
        className="bg-primary dark:bg-sendyOpacity transition-all duration-300 hover:bg-opacity-40 dark:hover:bg-opacity-40"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Menu />
        <span className="sr-only">Menu</span>
      </Button>
    </div>
  );
}
