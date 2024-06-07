'use client';

/* eslint-disable @typescript-eslint/no-empty-function */
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useAccount } from 'wagmi';
import { useTrnApi } from './TrnApiProvider';

// import { useFuturePass } from '@/hooks/useFuturePass';

import useGetBalances from '@/hooks/useGetBalances';

import useGetAllBalances from '@/hooks/useGetAllBalances';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { providers } from 'ethers';
import { networks } from 'rootnameservice';
import { useFutureverse } from '@futureverse/react';
import * as api from '@/api';
import type { IAcceptedTokensWithBalances, ITokensWithBalances } from '@/types';
import { env } from '@/env';

export interface AccountProps {
  account: string;
  futurePass: string | null;
  balances?: IAcceptedTokensWithBalances;
  futurePassBalances?: IAcceptedTokensWithBalances;
  activeAccount: 'eoa' | 'futurePass';
  setActiveAccount: Dispatch<SetStateAction<'eoa' | 'futurePass'>>;
  activeAccountAddress: string;
  setActiveAccountAddress: Dispatch<SetStateAction<string>>;
  chosenGasToken: number;
  setChosenGasToken: Dispatch<SetStateAction<number>>;
  tokensWithBalances: ITokensWithBalances | undefined | null;
  fetchingTokens: boolean;
  loadingTokens: boolean;
  fetchedTokens: boolean;
  rnsAddyEoa: string | null;
  rnsAddyFuturePass: string | null;
  isWhitelisted: boolean;
  checkingWhitelist: boolean;
}

const defaultAccount: AccountProps = {
  account: '',
  futurePass: null,
  balances: [],
  futurePassBalances: [],
  activeAccount: 'eoa',
  setActiveAccount: () => null,
  activeAccountAddress: '',
  setActiveAccountAddress: () => null,
  chosenGasToken: 2,
  setChosenGasToken: () => null,
  tokensWithBalances: null,
  fetchingTokens: false,
  loadingTokens: false,
  fetchedTokens: false,
  rnsAddyEoa: null,
  rnsAddyFuturePass: null,
  isWhitelisted: false,
  checkingWhitelist: false,
};

const ROOT_RPC =
  env.NEXT_PUBLIC_NETWORK === 'root'
    ? 'https://root.rootnet.live/archive'
    : 'https://porcini.rootnet.app/archive';

const AccountContext: React.Context<AccountProps> =
  createContext(defaultAccount);

export function useAccountProvider(): AccountProps {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccountProvider must be used within a AccountProvider');
  }
  return context;
}

export const AccountProvider: React.FC<{
  children: ReactNode;
}> = props => {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const { rootApi } = useTrnApi();
  const { userSession } = useFutureverse();

  const {
    data: wallets,
    isFetching: isWalletFetching,
    isError: isWalletError,
  } = useQuery({
    queryKey: ['wallets'],
    queryFn: api.wallet.getWallets,
  });

  const [activeAccount, setActiveAccount] = useState<'eoa' | 'futurePass'>(
    'eoa'
  );

  const [activeAccountAddress, setActiveAccountAddress] = useState<string>(
    address?.toString() ?? ''
  );

  const [chosenGasToken, setChosenGasToken] = useState(2);

  const account = useMemo(() => {
    return userSession ? address?.toString() : '';
  }, [address, userSession]);

  const futurePass = useMemo(() => {
    return userSession ? userSession?.futurepass : '';
  }, [userSession]);

  const { data: balanceData, refetch: refetchBalances } = useGetBalances(
    rootApi,
    address?.toString() ?? ''
  );

  const { data: futurePassBalancesData, refetch: refetchFpBalances } =
    useGetBalances(rootApi, futurePass ?? '');

  useEffect(() => {
    if (account !== '') {
      void refetchBalances();
      void refetchFpBalances();
    }
  }, [account, refetchBalances, refetchFpBalances]);

  const {
    data: tokens,
    isFetching: fetchingTokens,
    isLoading: loadingTokens,
    isFetched: fetchedTokens,
  } = useGetAllBalances(
    rootApi,
    (activeAccount === 'eoa' ? address : futurePass ?? '') ?? ''
  );

  const tokensWithBalances = useMemo(() => {
    return (
      tokens?.filter(
        token => token.balance && parseInt(token.balance.toString()) > 0
      ) ?? []
    );
  }, [tokens]);

  useEffect(() => {
    void (async () => {
      if (tokensWithBalances.length === 0 && fetchedTokens) {
        await queryClient.invalidateQueries();
      }
    })();
  }, [fetchedTokens, queryClient, tokensWithBalances]);

  const [rnsAddyEoa, setRnsAddyEoa] = useState<string | null>(null);
  const [rnsAddyFuturePass, setRnsAddyFuturePass] = useState<string | null>(
    null
  );

  useEffect(() => {
    const provider = new providers.JsonRpcProvider(
      ROOT_RPC,
      env.NEXT_PUBLIC_NETWORK === 'root' ? networks.root : networks.porcini
    );

    const fetchRnsAddyEoa = async () => {
      if (!address || address.toString() === '') {
        return;
      }

      const resultEoa = await provider.lookupAddress(address?.toString());
      setRnsAddyEoa(resultEoa);
    };

    const fetchRnsAddyFuturePass = async () => {
      if (!futurePass) {
        return;
      }

      const resultFuturePass = await provider.lookupAddress(futurePass);
      setRnsAddyFuturePass(resultFuturePass);
    };

    void fetchRnsAddyEoa();
    void fetchRnsAddyFuturePass();
  }, [address, futurePass]);

  const isWhitelisted = useMemo(() => {
    if (!address || address.toString() === '' || !wallets || isWalletError) {
      return false;
    }
    if (isWalletFetching) {
      return false;
    }

    return wallets
      ?.map((w: string) => w.toLowerCase())
      ?.includes(address.toLowerCase());
  }, [address, wallets, isWalletError, isWalletFetching]);

  return (
    <AccountContext.Provider
      value={{
        account: account?.toString() ?? '',
        futurePass: futurePass,
        balances: balanceData,
        futurePassBalances: futurePassBalancesData,
        activeAccount,
        setActiveAccount,
        chosenGasToken,
        setChosenGasToken,
        tokensWithBalances,
        fetchingTokens,
        loadingTokens,
        fetchedTokens,
        activeAccountAddress,
        setActiveAccountAddress,
        rnsAddyEoa,
        rnsAddyFuturePass,
        isWhitelisted,
        checkingWhitelist: isWalletFetching,
        // balances:
      }}
    >
      {props.children}
    </AccountContext.Provider>
  );
};
