import { getAllTokens } from '@/lib/extrinsics';
import { useNetworkSelector } from '@/Providers/NetworkSelectorProvider';
import { type ApiPromise } from '@polkadot/api';

import { useQuery } from '@tanstack/react-query';

export const useGetAllTokens = (
  rootApi: ApiPromise | null,
  address: string
) => {
  const { network } = useNetworkSelector();

  if (!rootApi) {
    throw new Error('TRN API is not initialised');
  }
  return useQuery({
    queryKey: ['tokens', `${address}-${network}`, network],
    queryFn: async () => {
      if (!rootApi) {
        throw new Error('TRN API is not initialised');
      }
      return getAllTokens({ rootApi });
    },
    enabled: !!address && address !== '' && !!rootApi && !!network,
    refetchInterval: 1000 * 60,
    refetchOnWindowFocus: false,
  });
};
