/* eslint-disable @typescript-eslint/no-unsafe-call */
'use client';

import { useAccount } from 'wagmi';
import { Button } from './ui/button';

import { WalletDrawer } from './WalletDrawer';
import { useWalletProvider } from '@/Providers/WalletProvider';
import { useFutureverse } from '@futureverse/react';

export default function Wallet() {
  const { handleLogin } = useWalletProvider();
  const { isConnected } = useAccount();
  const { userSession } = useFutureverse();

  // console.log(
  //   'isConnected, isConnecting',
  //   isConnected,
  //   isConnecting,
  //   'userSession',
  //   userSession
  // );

  return (
    <>
      {!isConnected && (
        <Button
          className="dark:bg-sendyOpacity hover:bg-opacity-40 dark:hover:bg-opacity-40 transition-all duration-300 uppercase text-xs tracking-wider"
          onClick={() => handleLogin()}
        >
          Connect
        </Button>
      )}

      {isConnected && (
        <>
          {userSession && <WalletDrawer />}
          {!userSession && (
            <Button
              className="dark:bg-sendyOpacity hover:bg-opacity-40 dark:hover:bg-opacity-40 transition-all duration-300 uppercase text-xs tracking-wider"
              onClick={() => handleLogin()}
            >
              Log In
            </Button>
          )}
          {/* {status === 'loading' && (
            <div className="p-2 text-sm rounded-md inline-flex items-center justify-center border-[1px] light:border-primary dark:border-sendy">
              Logging In...
            </div>
          )} */}
        </>
      )}
    </>
  );
}
