import { useState, useCallback, useMemo } from 'react';

import { useRnsResolveRns } from '@/hooks/useRns';
import { utils } from 'ethers';
import useDebounce from './useDebounce';

const useAddress = () => {
  const [addressToSend, setAddressToSend] = useState<string>('');
  const { data: resolvedAddy, isFetching: rnsFetching } =
    useRnsResolveRns(addressToSend);
  const debouncedAddressToSend = useDebounce(
    resolvedAddy ?? addressToSend,
    500
  );

  const handleAddressChange = useCallback(async (address: string) => {
    setAddressToSend(address);
  }, []);

  const isValidAddress = useMemo(() => {
    try {
      return (
        !!debouncedAddressToSend && utils.getAddress(debouncedAddressToSend)
      );
    } catch {
      return false;
    }
  }, [debouncedAddressToSend]);

  return {
    addressToSend,
    setAddressToSend,
    debouncedAddressToSend,
    resolvedAddy,
    rnsFetching,
    handleAddressChange,
    isValidAddress,
  };
};

export default useAddress;
