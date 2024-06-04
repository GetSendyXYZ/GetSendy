'use client';

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { toast } from 'sonner';
import { useFutureverse } from '@futureverse/react';

export interface WalletProps {
  handleLogin: () => void;
  handleSignOut: () => void;
}

const defaultWallet: WalletProps = {
  handleLogin: () => null,
  handleSignOut: () => null,
};

const WalletContext: React.Context<WalletProps> = createContext(defaultWallet);

export function useWalletProvider(): WalletProps {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletProvider must be used within a WalletProvider');
  }
  return context;
}

export const WalletProvider: React.FC<{
  children: ReactNode;
}> = props => {
  const { isConnected, status: accountStatus } = useAccount();
  const { login, logout } = useFutureverse();

  const { disconnect } = useDisconnect();

  const handleLogin = useCallback(async () => {
    try {
      // console.log('login');
      login();
    } catch (error) {
      toast(`Sign in error: ${(error as Error).message}`);
    }
  }, [login]);

  const handleSignOut = useCallback(async () => {
    try {
      await logout({
        onBeforeRedirect: async () => {
          disconnect();
        },
      });
    } catch (error) {
      toast(`Sign out error: ${(error as Error).message}`);
    }
  }, [disconnect, logout]);

  useEffect(() => {
    if (accountStatus === 'connected' && status === 'unauthenticated') {
      void handleLogin();
    }
  }, [accountStatus, handleLogin, isConnected]);

  return (
    <WalletContext.Provider
      value={{
        handleLogin: () => void handleLogin(),
        handleSignOut: () => void handleSignOut(),
      }}
    >
      {props.children}
    </WalletContext.Provider>
  );
};
