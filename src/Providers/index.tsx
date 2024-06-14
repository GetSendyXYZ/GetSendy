'use client';
import type { PropsWithChildren } from 'react';

import { NetworkSelectorProvider } from './NetworkSelectorProvider';
import { TrnApiProvider } from './TrnApiProvider';
import { AccountProvider } from './AccountProvider';
import { WalletProvider } from './WalletProvider';
import { TXProvider } from './TxProvider';
import GasModal from '@/components/GasModal';
import { MenuProvider } from './MenuProvider';
import { SendyProvider } from './SendyProvider';
import SignatureConfirmModal from '@/components/SignatureConfirmModal';
import TxModal from '@/components/TxModal';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import FuturePassProvider from './FuturePassProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <FuturePassProvider>
        <TrnApiProvider>
          <TXProvider>
            <SendyProvider>
              <WalletProvider>
                {/* <NetworkSelectorProvider> */}
                <AccountProvider>
                  <MenuProvider>{children}</MenuProvider>
                  <GasModal />
                  <TxModal />
                  <SignatureConfirmModal />
                </AccountProvider>
                {/* </NetworkSelectorProvider> */}
              </WalletProvider>
            </SendyProvider>
          </TXProvider>
        </TrnApiProvider>
      </FuturePassProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
