import { getAddressFromRns, getRnsFromAddress } from '@/lib/rns';
import { useQuery } from '@tanstack/react-query';

export const useRnsResolveRns = (input: string) => {
  return useQuery({
    queryKey: ['rns', 'resolveRns', input],
    queryFn: async () => getAddressFromRns(input),
    enabled: !!input && input.endsWith('.root'),
    refetchInterval: 0,
    cacheTime: 1000 * 60 * 60 * 24,
  });
};

export const useRnsResolveAddress = (input: string) => {
  return useQuery({
    queryKey: ['rns', 'resolveAddress', input],
    queryFn: async () => getRnsFromAddress(input),
    enabled: !!input && input.startsWith('0x'),
    refetchInterval: 0,
    cacheTime: 1000 * 60 * 60 * 24,
  });
};
