'use client';

import { Loader } from '@/components/Loader';
import { useSignInHandler } from '@/hooks/useSignInHandler';

export default function Loading() {
  useSignInHandler();

  return (
    <Loader classes="h-[calc(100vh-100px)] w-full absolute top-0 left-0">
      <Loader.Logo />
      <Loader.AnimatedText text="Authenticating" />
    </Loader>
  );
}
