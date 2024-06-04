import { env } from '@/env';

const BASE_URL = env.NEXT_PUBLIC_BASE_URL;

export const wallet = {
  getWallets: () => {
    const url = `${BASE_URL}/api/getWallets`;
    return fetch(url).then(res => res.json()) as Promise<Array<string>>;
  },
};
