import { useSendyProvider } from '@/Providers/SendyProvider';
import { SendyProcess } from '@/types';
import React from 'react';
import Explainers from '../Explainers';
import { Button } from '../ui/button';

export default function DownloadDataStep({
  thisSendyProcess,
  nextSendyProcess,
}: {
  thisSendyProcess: SendyProcess;
  nextSendyProcess: SendyProcess;
}) {
  const { handleDownloadCSV, handleDownloadJSON } = useSendyProvider();
  const { currentSendyProcess } = useSendyProvider();

  return (
    <div
      className={`flex flex-col py-3 step ${currentSendyProcess >= thisSendyProcess ? 'active' : ''} `}
      data-step="Step 3"
      id="step-3"
    >
      <div className="p-2 inner">
        <h2>
          In order to progress to the next step, please check your distribution
          by downloading either the csv or json file.
        </h2>
      </div>
      <Explainers />
      <div className="mt-3 w-full grid grid-cols-2 gap-4">
        <Button
          className="w-full dark:bg-sendyOpacity hover:bg-opacity-40 dark:hover:bg-opacity-40 transition-all duration-300 uppercase text-xs tracking-wider"
          onClick={() =>
            handleDownloadCSV('sendy-nft-airdrop', nextSendyProcess)
          }
          disabled={
            currentSendyProcess >= SendyProcess.StageThree ? false : true
          }
        >
          Download CSV
        </Button>
        <Button
          className="w-full dark:bg-sendyOpacity hover:bg-opacity-40 dark:hover:bg-opacity-40 transition-all duration-300 uppercase text-xs tracking-wider"
          onClick={() =>
            handleDownloadJSON('sendy-nft-airdrop', nextSendyProcess)
          }
          disabled={
            currentSendyProcess >= SendyProcess.StageThree ? false : true
          }
        >
          Download JSON
        </Button>
      </div>
    </div>
  );
}
