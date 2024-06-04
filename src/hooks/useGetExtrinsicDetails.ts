/* eslint-disable @typescript-eslint/no-misused-promises */
import { type SubmittableExtrinsic } from '@polkadot/api/types';
import { type ISubmittableResult } from '@polkadot/types/types';
import { getGasToken } from '@/lib/utils';

import { useCallback } from 'react';

import { useTrnApi } from '@/Providers/TrnApiProvider';
import {
  useCreateEoaExtrinsic,
  useCreateEoaFeeProxyExtrinsic,
  useCreateFuturePassExtrinsic,
  useCreateFuturePassFeeProxyExtrinsic,
} from '@futureverse/mint-sdk-react';
import { useAccountProvider } from '@/Providers/AccountProvider';
import { TxStatus, useTxProvider } from '@/Providers/TxProvider';
import useSubmitExtrinsic from './useSubmitExtrinsic';
import { useQueryClient } from '@tanstack/react-query';

type Extrinsic = SubmittableExtrinsic<'promise', ISubmittableResult>;

export const useGetExtrinsicDetails = () => {
  const queryClient = useQueryClient();
  const { rootApi } = useTrnApi();

  const { mutateAsync: createEoaExtrinsic } = useCreateEoaExtrinsic(rootApi);
  const { mutateAsync: createEoaFeeProxyExtrinsic } =
    useCreateEoaFeeProxyExtrinsic(rootApi);
  const { mutateAsync: createFuturePassExtrinsic } =
    useCreateFuturePassExtrinsic(rootApi);
  const { mutateAsync: createFuturePassFeeProxyExtrinsic } =
    useCreateFuturePassFeeProxyExtrinsic(rootApi);

  const {
    setExtrinsicId,
    setExtrinsicResult,
    setTxError,
    setEncodedMessage,
    setGasFee,
    setIsInsufficientBalance,
    setTxPayload,
    setOnContinue,
    setIsPending,
    setIsDataLoading,
    setTxResult,
    setOnClose,
    setShowSignatureModal,
    setShowTxModal,
    setTxStatus,
    setOnSigned,
  } = useTxProvider();

  const { submitExtrinsicConfirmation } = useSubmitExtrinsic();

  const { balances, futurePassBalances, chosenGasToken, activeAccount } =
    useAccountProvider();

  const chosenTokenBalance =
    activeAccount === 'eoa'
      ? balances
        ? balances?.find(t => t.tokenId === chosenGasToken)?.balance
        : 0n
      : futurePassBalances
        ? futurePassBalances?.find(t => t.tokenId === chosenGasToken)?.balance
        : 0n;

  const getSetExtrinsicDetails = useCallback(
    async ({
      extrinsic,
      eoa,
      extraOnContinue,
      extraOnClose,
      futurePass,
    }: {
      extrinsic: Extrinsic;
      eoa: string;
      futurePass: string;
      extraOnContinue?: () => void;
      extraOnClose?: () => void;
    }) => {
      const getExtrinsicData = async (
        extrinsic: Extrinsic,
        eoa: string,
        futurePass: string
      ) => {
        switch (activeAccount) {
          case 'eoa':
            return chosenGasToken === 2
              ? await createEoaExtrinsic({ address: eoa, extrinsic })
              : await createEoaFeeProxyExtrinsic({
                  address: eoa,
                  extrinsic,
                  assetId: getGasToken(chosenGasToken),
                });
          case 'futurePass':
            return chosenGasToken === 2
              ? await createFuturePassExtrinsic({
                  address: eoa,
                  futurePassAddress: futurePass,
                  extrinsic,
                })
              : await createFuturePassFeeProxyExtrinsic({
                  address: eoa,
                  extrinsic,
                  assetId: getGasToken(chosenGasToken),
                  futurePassAddress: futurePass,
                });
          default:
            return null;
        }
      };

      setExtrinsicResult(null);
      setExtrinsicId(null);
      setTxError(null);

      const extrinsicData = await getExtrinsicData(extrinsic, eoa, futurePass);

      if (!extrinsicData) return;

      const {
        estimatedFee,
        payload,
        gas,
        extrinsic: extrinsicToUse,
      } = extrinsicData;
      const { ethPayload, trnPayload } = payload;

      setEncodedMessage(ethPayload.toString());
      setGasFee(gas);
      setIsInsufficientBalance(
        (chosenTokenBalance ?? 0) < BigInt(estimatedFee)
      );

      setTxStatus(TxStatus.Pending);

      setTxPayload(payload);

      const onSignedFunction = () => {
        setShowSignatureModal(false);
        setTxStatus(TxStatus.Processing);
      };

      const continueFunction = async () => {
        setTxStatus(TxStatus.Pending);

        try {
          setShowTxModal(true);
          setIsPending(true);
          setIsDataLoading(true);

          const res = await submitExtrinsicConfirmation(
            extrinsicToUse,
            ethPayload.toString() as `0x${string}`,
            trnPayload
          );

          await queryClient.invalidateQueries();

          setTxResult(res?.result);
          setExtrinsicResult(res);
          setExtrinsicId(res?.extrinsicId);

          setIsPending(false);

          extraOnContinue && extraOnContinue();
        } catch (error) {
          console.log('Submit Extrinsic:', error);
          setTxStatus(TxStatus.Failed);
          setIsPending(false);
        }
      };

      const cancelFunction = async () => {
        setTxStatus(TxStatus.Idle);
        setIsPending(false);
        setShowSignatureModal(false);
        extraOnClose && extraOnClose();
      };

      setOnSigned(() => onSignedFunction);
      setOnContinue(() => continueFunction);
      setOnClose(() => cancelFunction);

      setShowSignatureModal(true);

      return {
        ethPayload,
        trnPayload,
        estimatedFee,
        gas,
      };
    },
    [
      activeAccount,
      chosenGasToken,
      chosenTokenBalance,
      createEoaExtrinsic,
      createEoaFeeProxyExtrinsic,
      createFuturePassExtrinsic,
      createFuturePassFeeProxyExtrinsic,
      queryClient,
      setEncodedMessage,
      setExtrinsicId,
      setExtrinsicResult,
      setGasFee,
      setIsDataLoading,
      setIsInsufficientBalance,
      setIsPending,
      setOnClose,
      setOnContinue,
      setOnSigned,
      setShowSignatureModal,
      setShowTxModal,
      setTxError,
      setTxPayload,
      setTxResult,
      setTxStatus,
      submitExtrinsicConfirmation,
    ]
  );

  return { getSetExtrinsicDetails };
};
