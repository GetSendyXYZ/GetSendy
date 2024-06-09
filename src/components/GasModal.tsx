import React from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';

import { useTxProvider } from '@/Providers/TxProvider';
import { useAccountProvider } from '@/Providers/AccountProvider';

import { utils } from 'ethers';
import Image from 'next/image';

const GasModal: React.FC = () => {
  const { showGasModal, setShowGasModal } = useTxProvider();

  const {
    balances,
    futurePassBalances,
    activeAccount,
    activeAccountAddress,
    setChosenGasToken,
    chosenGasToken,
  } = useAccountProvider();

  const balancesToUse = activeAccount === 'eoa' ? balances : futurePassBalances;

  return (
    <Dialog
      open={showGasModal}
      onOpenChange={() => setShowGasModal(!showGasModal)}
    >
      <DialogContent
        className={`sm:max-w-[425px] backdrop-blur-[6px] justify-between items-center p-4 bg-mutedOpacity bg-opacity-60 rounded-lg grid grid-cols-1 w-full `}
      >
        <h4>Choose Gas Token</h4>

        {activeAccountAddress && (
          <div className="flex flex-row flex-wrap gap-2 mt-4">
            {balancesToUse
              ?.filter(token => token.balance > 0)
              .map(token => {
                return (
                  <React.Fragment key={token.tokenId}>
                    <div
                      className={`inline-flex flex-row justify-items-center items-center px-2 py-1 rounded-md bg-gray-300 text-primary dark:bg-gray-600 border-[1px] ${chosenGasToken === token.tokenId ? 'border-sendy' : 'border-transparent'} cursor-pointer`}
                      onClick={() => {
                        setChosenGasToken(token.tokenId);
                        setShowGasModal(false);
                      }}
                    >
                      <div className="image-wrap h-[16px] w-[16px] mr-1 ">
                        <Image
                          src={token.icon}
                          alt={token.name}
                          width={16}
                          height={16}
                        />
                      </div>
                      <div className="font-bold text-sm">
                        {parseFloat(
                          utils.formatUnits(token.balance, token.decimals)
                        ).toLocaleString()}{' '}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GasModal;
