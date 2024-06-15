import { useQuery } from '@tanstack/react-query';
import { env } from '@/env';
import { getBalances } from '@/lib/extrinsics';
import { useGetAllTokens } from './useGetAllTokens';
import useGetAllMetadata from './useGetAllMetadata';
import { useMemo } from 'react';

import type { ApiPromise } from '@polkadot/api';
import type { ITokens } from '@/types';

const useGetAllBalances = (rootApi: ApiPromise | null, address: string) => {
  const network = env.NEXT_PUBLIC_NETWORK;

  if (!rootApi) {
    throw new Error('TRN API is not initialised');
  }

  const { data: tokens } = useGetAllTokens(rootApi, address);
  const { data: tokensWithMetadata } = useGetAllMetadata(
    rootApi,
    address,
    tokens
  );

  const tokensToCheck: ITokens = useMemo(() => {
    return (
      tokensWithMetadata?.map(token => {
        return {
          slug: token.symbol,
          name: token.name,
          tokenId: parseInt(token.assetId! ?? '0'),
          icon: '',
          decimals: token.decimals,
        };
      }) ?? []
    );
  }, [tokensWithMetadata]);

  return useQuery({
    queryKey: ['all-balances', `${address}-${network}`, network],
    queryFn: async () => {
      if (!rootApi) {
        throw new Error('TRN API is not initialised');
      }

      return getBalances({
        rootApi,
        address,
        network,
        tokensToCheck: tokensToCheck,
      });
    },
    enabled:
      !!address &&
      address !== '' &&
      !!rootApi &&
      !!network &&
      !!tokensToCheck &&
      tokensToCheck.length > 0,
    refetchOnWindowFocus: true,
  });
};

export default useGetAllBalances;
