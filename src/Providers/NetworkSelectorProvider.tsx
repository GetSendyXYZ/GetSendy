import { type ReactNode, createContext, useContext, useState } from 'react';

import type { NetworkName } from '@therootnetwork/api';
import { env } from '@/env';
import type { NetworkProps } from '@/types';

const NetworkSelectorContext: React.Context<NetworkProps> = createContext(
  {} as unknown as NetworkProps
);

export function useNetworkSelector(): NetworkProps {
  return useContext(NetworkSelectorContext);
}

export const NetworkSelectorProvider: React.FC<{
  children: ReactNode;
}> = props => {
  const [network, setNetwork] = useState<NetworkName>(env.NEXT_PUBLIC_NETWORK);
  const [isChanging, setIsChanging] = useState(false);

  return (
    <NetworkSelectorContext.Provider
      value={{
        network,
        setNetwork,
        isChanging,
        setIsChanging,
      }}
    >
      {props.children}
    </NetworkSelectorContext.Provider>
  );
};
