import { useQueryClient } from '@tanstack/react-query';

import { DropNativeTokens } from './DropNativeTokens';
import Explainers from './Explainers';

import TokenDropDown from './TokenDropDown';
import { useSendyProvider } from '@/Providers/SendyProvider';

import { Button } from './ui/button';
import { useCallback } from 'react';
import { downloadCsv, downloadJson } from '@/utils';
import { useTxProvider } from '@/Providers/TxProvider';
import { useCreateBulkExtrinsic } from '@/hooks/useCreateBulkExtrinsic';
import { SendyProcess } from '@/types';

export default function AirdropTokens() {
  return (
    <div className="">
      <StepOne />
      <StepTwo />
      <StepThree />
      <StepFour />
    </div>
  );
}

const StepOne = () => {
  const queryClient = useQueryClient();
  const { currentSendyProcess } = useSendyProvider();

  return (
    <div
      className={`flex flex-col py-3 step ${currentSendyProcess >= SendyProcess.StageOne ? 'active' : ''}`}
      data-step="Step 1"
      id="step-1"
    >
      <div className="">
        <h2>Select tokens in your wallet</h2>
        <div className=" pt-2 inner relative">
          <div
            className="absolute top-7 right-8 -translate-x-2 -translate-y-1/2 grid py-1 px-2 text-[9px] uppercase text-sendy tracking-wider cursor-pointer rounded-lg bg-muted hover:bg-sendy hover:text-background transition-all duration-300 ease-in-out"
            onClick={async () => {
              await queryClient.invalidateQueries();
            }}
          >
            REFRESH TOKEN LIST
          </div>
          <TokenDropDown />
        </div>
      </div>
    </div>
  );
};

const StepTwo = () => {
  const { currentSendyProcess, BATCH_SIZE } = useSendyProvider();

  return (
    <div
      className={`flex flex-col py-3 step ${currentSendyProcess >= SendyProcess.StageTwo ? 'active' : ''} `}
      data-step="Step 2"
      id="step-2"
    >
      <div className="p-2 inner">
        <h2>
          Drag your CSV or enter your distribution manually in the text field.
          We can bulk send up to {BATCH_SIZE} transactions into one transaction,
          so please keep your list below this.
        </h2>
      </div>
      <DropNativeTokens />
    </div>
  );
};

const StepThree = () => {
  const { currentSendyProcess, downloadData, setCurrentSendyProcess } =
    useSendyProvider();

  const handleDownloadCSV = useCallback(() => {
    downloadCsv(downloadData, 'sendy-airdrop-data');
    setCurrentSendyProcess(SendyProcess.StageFour);
  }, [downloadData, setCurrentSendyProcess]);

  const handleDownloadJSON = useCallback(() => {
    downloadJson(downloadData, 'sendy-airdrop-data');
    setCurrentSendyProcess(SendyProcess.StageFour);
  }, [downloadData, setCurrentSendyProcess]);

  return (
    <div
      className={`flex flex-col py-3 step ${currentSendyProcess >= SendyProcess.StageThree ? 'active' : ''} `}
      data-step="Step 3"
      id="step-3"
    >
      <div className="p-2 inner">
        <h2>
          Check your distribution and click the button to send your tokens.
        </h2>
      </div>
      <Explainers />
      <div className="mt-3 w-full grid grid-cols-2 gap-4">
        <Button
          className="w-full dark:bg-sendyOpacity hover:bg-opacity-40 dark:hover:bg-opacity-40 transition-all duration-300 uppercase text-xs tracking-wider"
          onClick={() => handleDownloadCSV()}
          disabled={
            currentSendyProcess >= SendyProcess.StageThree ? false : true
          }
        >
          Download CSV
        </Button>
        <Button
          className="w-full dark:bg-sendyOpacity hover:bg-opacity-40 dark:hover:bg-opacity-40 transition-all duration-300 uppercase text-xs tracking-wider"
          onClick={() => handleDownloadJSON()}
          disabled={
            currentSendyProcess >= SendyProcess.StageThree ? false : true
          }
        >
          Download JSON
        </Button>
      </div>
    </div>
  );
};

const StepFour = () => {
  const queryClient = useQueryClient();
  const { currentSendyProcess, batchedExtrinsics } = useSendyProvider();
  const { setShowGasModal } = useTxProvider();
  const { submitExtrinsic } = useCreateBulkExtrinsic();

  const handleAirdrop = useCallback(async () => {
    if (batchedExtrinsics.length === 0 || !batchedExtrinsics) {
      return;
    }

    await submitExtrinsic({ extrinsics: batchedExtrinsics });

    await queryClient.invalidateQueries();
  }, [batchedExtrinsics, queryClient, submitExtrinsic]);

  return (
    <div
      className={`flex flex-col py-3 step ${currentSendyProcess >= SendyProcess.StageFour ? 'active' : ''} `}
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
};
