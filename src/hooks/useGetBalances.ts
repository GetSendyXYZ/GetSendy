import { useQuery } from '@tanstack/react-query';
import type { ApiPromise } from '@polkadot/api';
import { useNetworkSelector } from '@/Providers/NetworkSelectorProvider';

import { getBalances } from '@/lib/extrinsics';

const useGetBalances = (rootApi: ApiPromise | null, address: string | null) => {
  const { network } = useNetworkSelector();

  return useQuery({
    queryKey: ['balances', `${address}-${network}`, network],
    queryFn: async () => {
      if (!rootApi) {
        throw new Error('TRN API is not initialised');
      }
      return getBalances({ rootApi, address: address ?? '', network });
    },
    enabled: !!address && address !== '' && !!rootApi && !!network,
    refetchInterval:
      !!address && address !== '' && !!rootApi && !!network ? 1000 * 15 : false,
    refetchIntervalInBackground:
      !!address && address !== '' && !!rootApi && !!network ? true : false,
    refetchOnWindowFocus:
      !!address && address !== '' && !!rootApi && !!network ? true : false,
  });
};

export default useGetBalances;
