import { useTrnApi } from '@/Providers/TrnApiProvider';
import { TxStatus, useTxProvider } from '@/Providers/TxProvider';
import { useCallback } from 'react';

import {
  type SignerOptions,
  type SubmittableExtrinsic,
} from '@polkadot/api/types';
import { useAccount } from 'wagmi';

import {
  type ExtrinsicPayload,
  type ExtrinsicResult,
} from '@futureverse/mint-sdk';

import {
  useCreateExtrinsicPayload,
  useSignAndSendExtrinsic,
} from '@futureverse/mint-sdk-react';
import { type Signer } from 'ethers';
import type { Extrinsic } from '@/types';

export default function useTRN() {
  const { rootApi } = useTrnApi();
  const { address } = useAccount();

  const { onSigned, setTxStatus, setShowSignatureModal } = useTxProvider();

  const { mutateAsync: generateExtrinsicPayloadsAsync } =
    useCreateExtrinsicPayload(rootApi);

  const generateExtrinsicPayloads = useCallback(
    async (
      method: SubmittableExtrinsic<'promise'>['method'],
      options?: Partial<SignerOptions>
    ) => {
      if (!address) {
        throw new Error('Address is undefined.');
      }

      return await generateExtrinsicPayloadsAsync({
        account: address,
        method,
        options,
      });
    },
    [generateExtrinsicPayloadsAsync, address]
  );

  const { mutateAsync: signAndSendExtrinsicAsync } =
    useSignAndSendExtrinsic(rootApi);

  const signAndSendEOAExtrinsic = useCallback(
    async (
      payload: ExtrinsicPayload,
      extrinsic: Extrinsic,
      signer: Signer
    ): Promise<ExtrinsicResult> => {
      if (!address) {
        throw new Error('EoA was undefined.');
      }

      const result = await signAndSendExtrinsicAsync({
        account: address,
        extrinsic: extrinsic,
        payload,
        signer: signer,
        onSigned: () => {
          setTxStatus(TxStatus.Processing);
          setShowSignatureModal(false);
          onSigned && onSigned();
        },
      });

      return result;
    },
    [
      address,
      signAndSendExtrinsicAsync,
      setTxStatus,
      setShowSignatureModal,
      onSigned,
    ]
  );

  return {
    signAndSendEOAExtrinsic,
    generateExtrinsicPayloads,
  };
}
