import type { SubmittableExtrinsic } from '@polkadot/api/types';
import { type ISubmittableResult } from '@polkadot/types/types';

import { useCallback } from 'react';

import { useTxProvider, TxStatus } from '@/Providers/TxProvider';
import useTRN from './useTRN';
import { useSendyProvider } from '@/Providers/SendyProvider';

import { useSigner } from 'wagmi';
import { type GenericSignerPayload } from '@polkadot/types';

export default function useSubmitExtrinsic() {
  const { data: signer } = useSigner();

  const { resetSendyProvider } = useSendyProvider();

  const {
    setExtrinsicId,
    setExtrinsicResult,
    setIsPending,
    setShowSignatureModal,
    setTxStatus,
  } = useTxProvider();

  const { signAndSendEOAExtrinsic } = useTRN();

  const submitExtrinsicConfirmation = useCallback(
    async (
      extrinsic: SubmittableExtrinsic<'promise', ISubmittableResult>,
      ethPayload: `0x${string}`,
      trnPayload: GenericSignerPayload
    ) => {
      try {
        // if (!client) {
        if (!signer) {
          throw new Error('Signer is not initialised');
        }

        setIsPending(false);

        const result = await signAndSendEOAExtrinsic(
          {
            ethPayload: ethPayload,
            trnPayload: trnPayload,
          },
          extrinsic,
          signer
        );

        setExtrinsicId(result.extrinsicId);
        setExtrinsicResult(result);

        setTxStatus(TxStatus.Success);

        setShowSignatureModal(false);
        await resetSendyProvider();

        return result;
      } catch (error) {
        console.log('Submit Extrinsic:', error);

        setTxStatus(TxStatus.Failed);
        setIsPending(false);

        setShowSignatureModal(false);
      }
    },
    [
      signer,
      setIsPending,
      signAndSendEOAExtrinsic,
      setExtrinsicId,
      setExtrinsicResult,
      setTxStatus,
      setShowSignatureModal,
      resetSendyProvider,
    ]
  );

  return { submitExtrinsicConfirmation };
}
