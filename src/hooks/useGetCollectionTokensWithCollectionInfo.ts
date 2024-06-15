/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { getCollectionInfo, getCollectionTokens } from '@/lib/extrinsics';
import { env } from '@/env';

import type { ApiPromise } from '@polkadot/api';
import { useQuery } from '@tanstack/react-query';
import { hexToString } from '@polkadot/util';

type CollectionInfo = {
  name: string;
  metadataScheme: string;
  collectionIssuance: string;
};

export const useGetCollectionTokensWithCollectionInfo = (
  rootApi: ApiPromise | null,
  collectionId: string,
  address: string
) => {
  const network = env.NEXT_PUBLIC_NETWORK;
  if (!rootApi) {
    throw new Error('TRN API is not initialised');
  }
  return useQuery({
    queryKey: [
      'collection-tokens-collection-info',
      `${address}-${network}-${collectionId}`,
      network,
      collectionId,
    ],
    queryFn: async () => {
      if (!rootApi) {
        throw new Error('TRN API is not initialised');
      }
      const tokens = getCollectionTokens({
        rootApi,
        collectionId: parseInt(collectionId),
        address,
      });

      const collectionInfo = getCollectionInfo({
        rootApi,
        collectionId: parseInt(collectionId),
      });

      const [tokensData, collectionInfoData] = await Promise.all([
        tokens,
        collectionInfo,
      ]);

      return {
        collectionInfo: {
          name: hexToString((collectionInfoData as CollectionInfo)?.name),
          tokenUri: hexToString(
            (collectionInfoData as CollectionInfo)?.metadataScheme
          ),
          collectionIssuance: (
            collectionInfoData as CollectionInfo
          )?.collectionIssuance.toString(),
        },
        tokens: tokensData,
      };
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
