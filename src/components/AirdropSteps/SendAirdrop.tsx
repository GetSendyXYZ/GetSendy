import { useCreateBulkExtrinsic } from '@/hooks/useCreateBulkExtrinsic';
import { useSendyProvider } from '@/Providers/SendyProvider';
import { useTxProvider } from '@/Providers/TxProvider';
import { SendyProcess } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { Button } from '../ui/button';

export default function SendAirdrop({
  thisSendyProcess,
}: {
  thisSendyProcess: SendyProcess;
}) {
  const queryClient = useQueryClient();
  const { setShowGasModal } = useTxProvider();
  const { submitExtrinsic } = useCreateBulkExtrinsic();

  const { currentSendyProcess, batchedExtrinsics } = useSendyProvider();

  const handleAirdrop = useCallback(async () => {
    if (batchedExtrinsics.length === 0 || !batchedExtrinsics) {
      return;
    }

    await submitExtrinsic({ extrinsics: batchedExtrinsics });

    await queryClient.invalidateQueries();
  }, [batchedExtrinsics, queryClient, submitExtrinsic]);

  return (
    <div
      className={`flex flex-col py-3 step ${currentSendyProcess >= thisSendyProcess ? 'active' : ''} `}
      data-step="Step 5"
      id="step-5"
    >
      <div className="mt-3 mb-3 w-full grid grid-cols-1 gap-4">
        <div className="grid grid-cols-4">
          <Button
            className="dark:bg-sendyOpacity hover:bg-opacity-40 dark:hover:bg-opacity-40  transition-all duration-300 w-full rounded-tr-none rounded-br-none col-span-3"
            onClick={() => handleAirdrop()}
            disabled={
              currentSendyProcess >= SendyProcess.StageFour ? false : true
            }
          >
            Airdrop Tokens
          </Button>
          <Button
            className="dark:bg-sendyOpacity bg-sendyOpacity dark:bg-opacity-20 bg-opacity-20 hover:bg-opacity-40 dark:hover:bg-opacity-40 text-white hover:text-white transition-all duration-300 w-full rounded-tl-none rounded-bl-none "
            onClick={() => setShowGasModal(true)}
          >
            <span className="text-xs uppercase ">Gas</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
