import { useQuery } from '@tanstack/react-query';
import { env } from '@/env';
import { getTokenMetadata } from '@/lib/extrinsics';
import { type ApiPromise } from '@polkadot/api';
import type { ITokensToCheck } from '@/types';

const useGetAllMetadata = (
  rootApi: ApiPromise | null,
  address: string,
  tokens: ITokensToCheck
) => {
  const network = env.NEXT_PUBLIC_NETWORK;

  if (!rootApi) {
    throw new Error('TRN API is not initialised');
  }

  return useQuery({
    queryKey: ['all-metadata', `${address}-${network}`, network],
    queryFn: async () => {
      if (!rootApi) {
        throw new Error('TRN API is not initialised');
      }
      return getTokenMetadata({
        rootApi,
        tokensToCheck: tokens,
      });
    },
    enabled: !!address && address !== '' && !!rootApi && !!tokens,
    refetchInterval: 1000 * 60,
    refetchOnWindowFocus: false,
  });
};

export default useGetAllMetadata;
