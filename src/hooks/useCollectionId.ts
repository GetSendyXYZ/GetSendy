import { addressToCollectionId } from '@/lib/utils';
import { useSendyProvider } from '@/Providers/SendyProvider';
import { useMemo } from 'react';

export const useCollectionId = (debouncedCollectionId: string) => {
  const { setSelectedCollectionId } = useSendyProvider();

  const isAddress = useMemo(() => {
    if (debouncedCollectionId.startsWith('0x')) {
      return true;
    }
    return false;
  }, [debouncedCollectionId]);

  const collectionIdToUse = useMemo(() => {
    if (isAddress) {
      const col = addressToCollectionId(debouncedCollectionId);
      setSelectedCollectionId(col);
      return col.toString();
    }
    setSelectedCollectionId(parseInt(debouncedCollectionId));
    return debouncedCollectionId;
  }, [isAddress, setSelectedCollectionId, debouncedCollectionId]);

  // useEffect(() => {
  //   if (collectionIdToUse !== '') {
  //     setSelectedCollectionId(parseInt(collectionIdToUse));
  //   }
  // }, [collectionIdToUse, setSelectedCollectionId]);

  return collectionIdToUse;
};
