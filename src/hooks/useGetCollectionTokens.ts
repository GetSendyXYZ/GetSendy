import { getCollectionTokens } from '@/lib/extrinsics';
import { useNetworkSelector } from '@/Providers/NetworkSelectorProvider';

import type { ApiPromise } from '@polkadot/api';
import { useQuery } from '@tanstack/react-query';

export const useGetCollectionTokens = (
  rootApi: ApiPromise | null,
  collectionId: string,
  address: string
) => {
  const { network } = useNetworkSelector();
  if (!rootApi) {
    throw new Error('TRN API is not initialised');
  }
  return useQuery({
    queryKey: [
      'collection-tokens',
      `${address}-${network}-${collectionId}`,
      network,
      collectionId,
    ],
    queryFn: async () => {
      if (!rootApi) {
        throw new Error('TRN API is not initialised');
      }
      return getCollectionTokens({
        rootApi,
        collectionId: parseInt(collectionId),
        address,
      });
    },
    enabled:
      !!address &&
      address !== '' &&
      !!rootApi &&
      !!network &&
      !!collectionId &&
      !isNaN(parseInt(collectionId)) &&
      collectionId !== '' &&
      !collectionId.startsWith('0x') &&
      collectionId !== '0',

    refetchInterval: 1000 * 60,
    refetchOnWindowFocus: false,
  });
};
