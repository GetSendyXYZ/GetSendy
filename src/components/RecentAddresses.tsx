import { useSendyProvider } from '@/Providers/SendyProvider';
import { shortenAddress } from '@/utils';
import React, { Fragment } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from '@radix-ui/react-select';

export const RecentAddresses = ({
  setShowRecentAddresses,
  setAddressToSend,
  handleAddressChange,
}: {
  setShowRecentAddresses: (show: boolean) => void;
  setAddressToSend: (address: string) => void;
  handleAddressChange?: (address: string) => void;
}) => {
  const { recentlyUsedAddresses } = useSendyProvider();

  return (
    <div className="absolute bottom-0 right-2 translate-y-full z-50 text-foreground">
      <ScrollArea
        className="h-72 w-48 0 bg-background border border-muted dark:border-sendy rounded-md"
        onMouseLeave={() => setShowRecentAddresses(false)}
      >
        <div className="">
          {recentlyUsedAddresses.map(address => (
            <Fragment key={address}>
              <div
                key={`wallet-address-${address}`}
                className="px-2 py-4 text-xs cursor-pointer hover:bg-muted dark:hover:bg-sendy hover:text-background transition-all duration-300 ease-in-out"
                onClick={() => {
                  setAddressToSend(address);
                  setShowRecentAddresses(false);
                  if (address.includes('.root')) {
                    handleAddressChange && void handleAddressChange(address);
                  }
                }}
              >
                {address.includes('.root') ? address : shortenAddress(address)}
              </div>
              <Separator className="" />
            </Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
