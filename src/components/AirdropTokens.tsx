import { DropNativeTokens } from './AirdropSteps/DropNativeTokens';
import { SendyProcess } from '@/types';
import SendAirdrop from './AirdropSteps/SendAirdrop';
import DownloadDataStep from './AirdropSteps/DownloadDataStep';
import DropComponent from './AirdropSteps/DropComponent';
import { TokensWithRecent } from './TokensWithRecent';
import { useSendyProvider } from '@/Providers/SendyProvider';

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
  const { currentSendyProcess } = useSendyProvider();
  return (
    <div
      className={`flex flex-col py-3 step ${currentSendyProcess >= SendyProcess.StageOne ? 'active' : ''}`}
      data-step="Step 1"
      id="step-1"
    >
      <TokensWithRecent />
    </div>
  );
};

const StepTwo = () => {
  return (
    <DropComponent thisSendyProcess={SendyProcess.StageTwo}>
      <DropNativeTokens />
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
