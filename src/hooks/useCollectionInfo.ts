import { useMemo } from 'react';
import type { useGetCollectionTokensWithCollectionInfo } from './useGetCollectionTokensWithCollectionInfo';

type CollectionTokensInfo = ReturnType<
  typeof useGetCollectionTokensWithCollectionInfo
>;

export const useCollectionInfo = ({ data }: CollectionTokensInfo) => {
  const collectionName = useMemo(() => {
    if (!data) {
      return '';
    }

    const colName = data?.collectionInfo.name.toString();
    return colName;
  }, [data]);

  const collectionMetadata = useMemo(() => {
    if (!data) {
      return '';
    }

    const colMetadata = data.collectionInfo.tokenUri.toString();
    return colMetadata;
  }, [data]);

  return { collectionName, collectionMetadata };
};
