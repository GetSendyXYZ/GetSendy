'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import { useNetworkSelector } from '@/Providers/NetworkSelectorProvider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

export function NetworkSelector({ flipped = false }) {
  const { setTheme } = useTheme();
  const { network, setNetwork, setIsChanging } = useNetworkSelector();

  const [currentTheme, setCurrentTheme] = React.useState('dark');

  React.useEffect(() => {
    setCurrentTheme(localStorage.getItem('theme') ?? 'dark');
  }, []);

  React.useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme, setTheme]);

  const handleNetworkChange = (net: boolean) => {
    setIsChanging(true);
    setNetwork(net ? 'root' : 'porcini');
    setIsChanging(false);
  };

  return (
    <div
      className={`flex ${flipped ? 'flex-row-reverse' : 'flex-row '} items-center `}
    >
      <Label htmlFor="network">
        {network === 'root' ? 'The Root Network' : 'Porcini Testnet'}
      </Label>
      <Switch
        id="network"
        checked={network === 'root'}
        onCheckedChange={handleNetworkChange}
        className={`${flipped ? 'mr-2' : 'ml-2'}`}
      />
    </div>
  );
}
