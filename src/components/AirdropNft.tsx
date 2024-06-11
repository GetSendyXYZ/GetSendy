import { SendyProcess } from '@/types';
import { DropNativeNfts } from './AirdropSteps/DropNativeNfts';
import DownloadDataStep from './AirdropSteps/DownloadDataStep';
import DropComponent from './AirdropSteps/DropComponent';
import SendAirdrop from './AirdropSteps/SendAirdrop';
import CollectionsWithRecentAndCommon from './CollectionsWithRecentAndCommon';
import { useSendyProvider } from '@/Providers/SendyProvider';

export default function AirdropNft() {
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
  const { currentSendyProcess } = useSendyProvider();
  return (
    <div
      className={`flex flex-col py-3 step ${currentSendyProcess >= SendyProcess.StageOne ? 'active' : ''}`}
      data-step="Step 1"
      id="step-1"
    >
      <CollectionsWithRecentAndCommon />
    </div>
  );
};

const StepTwo = () => {
  return (
    <DropComponent thisSendyProcess={SendyProcess.StageTwo}>
      <DropNativeNfts />
    </DropComponent>
  );
};

const StepThree = () => {
  return (
    <DownloadDataStep
      thisSendyProcess={SendyProcess.StageThree}
      nextSendyProcess={SendyProcess.StageFour}
    />
  );
};

const StepFour = () => {
  return <SendAirdrop thisSendyProcess={SendyProcess.StageFour} />;
};
