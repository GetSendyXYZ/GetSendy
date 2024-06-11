import { useEffect, useMemo, useState } from 'react';
import { addressToCollectionId } from '@/lib/utils';

import { useGetCollectionTokensWithCollectionInfo } from '@/hooks/useGetCollectionTokensWithCollectionInfo';
import { useCollectionInfo } from '@/hooks/useCollectionInfo';
import { useSendyProvider } from '@/Providers/SendyProvider';
import { useTrnApi } from '@/Providers/TrnApiProvider';
import { useAccountProvider } from '@/Providers/AccountProvider';
import useDebounce from './useDebounce';

const useCollectionData = (initialCollectionId: string) => {
  const { rootApi } = useTrnApi();
  const { activeAccount, account, futurePass } = useAccountProvider();
  const { selectedPairs } = useSendyProvider();

  const [collectionId, setCollectionId] = useState<string>(initialCollectionId);
  const debouncedCollectionId = useDebounce(collectionId, 500);

  useEffect(() => {
    setCollectionId(initialCollectionId);
  }, [initialCollectionId]);

  const isAddress = useMemo(
    () => debouncedCollectionId.startsWith('0x'),
    [debouncedCollectionId]
  );

  const collectionIdToUse = useMemo(() => {
    const colId = isAddress
      ? addressToCollectionId(collectionId)
      : parseInt(collectionId);
    return colId.toString();
  }, [isAddress, collectionId]);

  const collectionData = useGetCollectionTokensWithCollectionInfo(
    rootApi,
    collectionIdToUse ?? '',
    activeAccount === 'eoa' ? account.toString() : (futurePass ?? '').toString()
  );
  const { data, isLoading, isFetching } = collectionData;
  const { collectionName, collectionMetadata } =
    useCollectionInfo(collectionData);

  const tokens = useMemo(() => {
    if (!data) return [];
    const allTokens =
      (data.tokens?.[2] as number[])?.map(token => ({ id: token })) ?? [];
    return allTokens.filter(
      token =>
        !selectedPairs.some(
          pair =>
            pair.collectionId === collectionIdToUse && pair.tokenId === token.id
        )
    );
  }, [data, selectedPairs, collectionIdToUse]);

  return {
    collectionId,
    setCollectionId,
    collectionIdToUse,
    collectionName,
    collectionMetadata,
    tokens,
    isLoading,
    isFetching,
  };
};

export default useCollectionData;
