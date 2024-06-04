'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function DarkModeToggle() {
  const { setTheme } = useTheme();

  const [currentTheme, setCurrentTheme] = React.useState('dark');

  React.useEffect(() => {
    setCurrentTheme(localStorage.getItem('theme') ?? 'dark');
  }, []);

  React.useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme, setTheme]);

  return (
    <Button
      variant="default"
      size="icon"
      className="bg-primary dark:bg-sendyOpacity transition-all duration-300 hover:bg-opacity-40 dark:hover:bg-opacity-40"
      onClick={() =>
        currentTheme === 'dark'
          ? setCurrentTheme('light')
          : setCurrentTheme('dark')
      }
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-0 transition-all dark:-rotate-90 dark:scale-100" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-100 transition-all dark:rotate-0 dark:scale-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
