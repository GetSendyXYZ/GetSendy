'use client';

import { useAccountProvider } from '@/Providers/AccountProvider';
import { Loader } from '@/components/Loader';
import Loading from '@/components/Loading';
import NotAuthed from '@/components/NotAuthed';
import NotOnWhiteList from '@/components/NotOnWhiteList';
import { env } from '@/env';
import { useFutureverse } from '@futureverse/react';

import { useAccount } from 'wagmi';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userSession } = useFutureverse();
  const { isConnecting, isConnected } = useAccount();
  const { isWhitelisted, checkingWhitelist } = useAccountProvider();

  const network = env.NEXT_PUBLIC_NETWORK;

  if (network === 'root') {
    return (
      <Loader classes="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader.Logo />
        <Loader.Text text="Sorry, this is not available On mainnet"></Loader.Text>
        <div>
          <a
            href="https://porcini.getsendy.xyz/incinerate"
            target="_blank"
            rel="noreferrer nofollow"
            className="text-base underline cursor-pointer"
          >
            Try incinerate on porcini
          </a>
        </div>
      </Loader>
    );
  }

  if (isConnecting) {
    return <Loading />;
  }

  if (!userSession || !isConnected) {
    return <NotAuthed />;
  }

  if (checkingWhitelist) {
    return (
      <Loader classes="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader.AnimatedText text="Checking Allowlist"></Loader.AnimatedText>
      </Loader>
    );
  }

  if (!isWhitelisted) {
    return <NotOnWhiteList />;
  }

  return <div className="mt-28 pt-2 authorised">{children}</div>;
}
