'use client';

import { Loader } from '@/components/Loader';

export default function Loading() {
  return (
    <Loader classes="!w-auto !h-auto -ml-4 -mt-4">
      <Loader.Logo />
      <Loader.AnimatedText text="Loading Sendy" />
    </Loader>
  );
}
