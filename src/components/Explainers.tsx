import React from 'react';
import { useSendyProvider } from '@/Providers/SendyProvider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAccountProvider } from '@/Providers/AccountProvider';

export default function Explainers() {
  const { explainers, selectedTokenSymbol } = useSendyProvider();
  const { activeAccount } = useAccountProvider();

  return (
    <ScrollArea
      className={`${explainers && explainers.length > 0 ? 'h-64' : 'h-32'} w-full rounded-md border`}
    >
      <div className="p-4">
        {selectedTokenSymbol && activeAccount && (
          <h3 className="mb-4 text-sm font-medium leading-none">
            Sending {selectedTokenSymbol} from {activeAccount}
          </h3>
        )}
        <h4 className="mb-4 text-sm font-medium leading-none">
          {explainers && explainers.length > 0 ? `Get Sendy Actions` : ''}
        </h4>
        {explainers &&
          explainers.length > 0 &&
          explainers.map((explainer, index) => (
            <React.Fragment key={`explainer-${index}`}>
              <div className="text-sm">{explainer}</div>
              <Separator className="my-2" />
            </React.Fragment>
          ))}
      </div>
    </ScrollArea>
  );
}
