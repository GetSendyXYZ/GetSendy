'use client';

/* eslint-disable @typescript-eslint/no-empty-function */
import { type ReactNode, createContext, useContext, useState } from 'react';

export interface MenuProps {
  menuOpen: boolean;
  setMenuOpen: (menuOpen: boolean) => void;
}

const defaultAccount: MenuProps = {
  menuOpen: false,
  setMenuOpen: () => null,
};

const MenuContext: React.Context<MenuProps> = createContext(defaultAccount);

export function useMenuProvider(): MenuProps {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenuProvider must be used within a MenuProvider');
  }
  return context;
}

export const MenuProvider: React.FC<{
  children: ReactNode;
}> = props => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <MenuContext.Provider value={{ menuOpen, setMenuOpen }}>
      {props.children}
    </MenuContext.Provider>
  );
};
