'use client';
import Loading from '@/components/Loading';
import NotAuthed from '@/components/NotAuthed';
import NotOnWhiteList from '@/components/NotOnWhiteList';

import { useAccount } from 'wagmi';
import { useFutureverse } from '@futureverse/react';
import { useAccountProvider } from '@/Providers/AccountProvider';
import { Loader } from '@/components/Loader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userSession } = useFutureverse();
  const { isConnecting, isConnected } = useAccount();
  const { isWhitelisted, checkingWhitelist } = useAccountProvider();

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
