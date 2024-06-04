/* eslint-disable @typescript-eslint/no-unsafe-call */
'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function HeadToAppButton() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/app');
  };

  return (
    <Button
      className="dark:bg-sendyOpacity hover:bg-opacity-40 dark:hover:bg-opacity-40 transition-all duration-300 uppercase text-xs tracking-wider"
      onClick={() => handleLogin()}
    >
      Head to Get Sendy
    </Button>
  );
}
