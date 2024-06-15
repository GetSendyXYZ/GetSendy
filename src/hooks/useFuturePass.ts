import { env } from '@/env';
import { type ApiPromise } from '@polkadot/api';

import { useQuery } from '@tanstack/react-query';

export const useFuturePass = (rootApi: ApiPromise | null, address: string) => {
  const network = env.NEXT_PUBLIC_NETWORK;

  if (!rootApi) {
    throw new Error('TRN API is not initialised');
  }

  return useQuery({
    queryKey: ['futurePass', `${address}-${network}`, network],
    queryFn: async () => {
      const fp = await rootApi.query.futurepass.holders(address);

      const futurePass = fp
        .unwrapOr('0x0000000000000000000000000000000000000000')
        .toString();

      return {
        futurePass,
      };
    },
    enabled: !!address && address !== '' && !!network,
    refetchOnWindowFocus: false,
  });
};
