import { useSendyProvider } from '@/Providers/SendyProvider';
import type { SendyProcess } from '@/types';
import type { PropsWithChildren } from 'react';

export default function DropComponent({
  children,
  thisSendyProcess,
}: PropsWithChildren<{ thisSendyProcess: SendyProcess }>) {
  const { currentSendyProcess, BATCH_SIZE } = useSendyProvider();

  return (
    <div
      className={`flex flex-col py-3 step ${currentSendyProcess >= thisSendyProcess ? 'active' : ''} `}
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
      {children}
    </div>
  );
}
