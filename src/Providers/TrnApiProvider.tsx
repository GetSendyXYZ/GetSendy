'use client';

import { ApiPromise } from '@polkadot/api';
import { getApiOptions, getProvider } from '@therootnetwork/api';
import React, {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import '@therootnetwork/api-types';

import { Loader } from '@/components/Loader';
import type { ApiProps } from '@/types';
import { env } from '@/env';

const ApiContext: React.Context<ApiProps> = createContext(
  {} as unknown as ApiProps
);

const ROOT_URL = 'wss://root.rootnet.live/ws';
const PORCINI_URL = 'wss://porcini.rootnet.app/ws';

export function useTrnApi(): ApiProps {
  const context = useContext(ApiContext);
  if (!context) throw new Error('ApiContext must be used with TrnProvider!');
  return context;
}

let rootApi: ApiPromise;

export { ApiPromise };

export const TrnApiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // const { network } = useNetworkSelector();
  const network = env.NEXT_PUBLIC_NETWORK;

  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isApiDisconnected, setIsApiDisconnected] = useState(false);
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [apiError, setApiError] = useState<null | string>(null);
  const [isApiConnecting, setIsApiConnecting] = useState(true);

  const value = useMemo<ApiProps>(
    () => ({
      currentNetwork: network,
      rootApi,
      apiError,
      isApiConnected,
      isApiInitialized,
      isApiReady,
      isApiConnecting,
    }),
    [
      apiError,
      isApiConnected,
      isApiConnecting,
      isApiInitialized,
      isApiReady,
      network,
    ]
  );

  const createCallBack = useCallback(async () => {
    rootApi = await ApiPromise.create({
      noInitWarn: true,
      ...getApiOptions(),
      ...getProvider(network === 'root' ? ROOT_URL : PORCINI_URL),
    });

    rootApi.on('connected', () => setIsApiConnected(true));

    rootApi.on('disconnected', () => setIsApiDisconnected(true));

    rootApi.on('error', (error: Error) => {
      //console.log('Error', error);
      setApiError(error.message);
      if (rootApi.isConnected) void rootApi.disconnect();
    });

    rootApi.on('ready', () => setIsApiReady(true));

    setIsApiConnecting(false);
    setIsApiInitialized(true);

    setTimeout(() => {
      setIsApiConnected(true);
    }, 2000);

    setIsApiConnecting(false);
    setIsApiInitialized(true);

    setIsApiConnected(true);
  }, [network]);

  // initial initialization
  useEffect((): void => {
    void createCallBack();

    () => {
      if (rootApi.isConnected) void rootApi.disconnect();
    };
  }, [createCallBack]);

  if (!value.isApiInitialized) {
    return (
      <Loader classes="!absolute !w-full !h-full top-0 left-0">
        <Loader.Logo />
        <Loader.Initialising />
      </Loader>
    );
  }

  if (isApiDisconnected) {
    return (
      <Loader classes="!absolute !w-full !h-full top-0 left-0">
        <Loader.Logo />
        <Loader.Content>
          <div className="flex flex-col justify-center content-center items-center">
            <h1 className="text-center uppercase font-black text-xl tracking-wider">
              API Disconnected
            </h1>
            <a
              className="text-base underline cursor-pointer"
              onClick={() => window.location.reload()}
            >
              Please Reload Application
            </a>
          </div>
        </Loader.Content>
      </Loader>
    );
  }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
