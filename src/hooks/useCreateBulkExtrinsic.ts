/* eslint-disable @typescript-eslint/ban-ts-comment */
import '@polkadot/api-augment';
import '@therootnetwork/api-types';

import { useCallback, useMemo } from 'react';
import { useGetExtrinsicDetails } from './useGetExtrinsicDetails';
import { useAccountProvider } from '@/Providers/AccountProvider';
import { useTrnApi } from '@/Providers/TrnApiProvider';
import { TxStatus, useTxProvider } from '@/Providers/TxProvider';
import type { ExtrinsicArray } from '@/types';

export const useCreateBulkExtrinsic = () => {
  const { activeAccount, account, futurePass } = useAccountProvider();
  const { setTxError, setTxStatus } = useTxProvider();

  const { getSetExtrinsicDetails } = useGetExtrinsicDetails();
  const { rootApi } = useTrnApi();

  const activeAddress = useMemo(() => {
    return activeAccount === 'eoa' ? account : futurePass;
  }, [activeAccount, account, futurePass]);

  const submitExtrinsic = useCallback(
    async ({ extrinsics }: { extrinsics: ExtrinsicArray }) => {
      if (!rootApi) return;
      setTxStatus(TxStatus.Pending);

      try {
        if (typeof activeAddress !== 'string') return;

        const extrinsic = rootApi.tx.utility.batch(extrinsics);

        await getSetExtrinsicDetails({
          extrinsic,
          eoa: account,
          futurePass: futurePass!,
        });
      } catch (error: unknown) {
        const { message, code } = error as { message: string; code: number };
        setTxError(message);

        setTxStatus(TxStatus.Failed);

        // don't display error message when user cancels sign request (code 4001)
        if (code !== 4001) setTxError(message);
      }
    },
    [
      rootApi,
      activeAddress,
      setTxStatus,
      getSetExtrinsicDetails,
      account,
      futurePass,
      setTxError,
    ]
  );

  return {
    submitExtrinsic,
  };
};
