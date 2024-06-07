'use client';

import React, { type PropsWithChildren } from 'react';

import { FutureverseAuthClient } from '@futureverse/react';

import { env } from '@/env';
import * as fvSdk from '@futureverse/experience-sdk';
import dynamic from 'next/dynamic';

const FutureverseProvider = dynamic(
  () => import('@futureverse/react').then(mod => mod.FutureverseProvider),
  {
    ssr: false,
  }
);

const authClient = new FutureverseAuthClient({
  clientId: env.NEXT_PUBLIC_FPASS,
  environment:
    env.NEXT_PUBLIC_NETWORK === 'porcini'
      ? fvSdk.ENVIRONMENTS.staging
      : fvSdk.ENVIRONMENTS.production,
  redirectUri:
    typeof window !== 'undefined' ? `${window.location.origin}/login` : '',
  responseType: 'code', // required for Custodial Auth
});

export default function FuturePassProvider({ children }: PropsWithChildren) {
  return (
    <FutureverseProvider
      stage={
        env.NEXT_PUBLIC_NETWORK === 'porcini' ? 'development' : 'production'
      }
      authClient={authClient}
      Web3Provider="wagmi"
      walletConnectProjectId={env.NEXT_PUBLIC_WALLET_CONNECT_ID}
      isCustodialLoginEnabled={true}
      isXamanLoginEnabled={true}
    >
      {children}
    </FutureverseProvider>
  );
}
