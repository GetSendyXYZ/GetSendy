import React, { useMemo } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import TxPayload from '@/components/TxPayload';
import { Button } from './ui/button';
import { useTxProvider } from '@/Providers/TxProvider';
import { useAccountProvider } from '@/Providers/AccountProvider';
import { useSendyProvider } from '@/Providers/SendyProvider';
import { utils } from 'ethers';

const SignatureConfirmModal: React.FC = () => {
  const {
    encodedMessage,
    txPayload,
    showSignatureModal,
    onClose,
    gasFee,
    isPending,
    onContinue,
  } = useTxProvider();

  const { tokensWithBalances, chosenGasToken } = useAccountProvider();
  const { assetTotals } = useSendyProvider();

  const gasTokenName = useMemo(() => {
    return tokensWithBalances?.find(t => t.tokenId === chosenGasToken)?.slug;
  }, [tokensWithBalances, chosenGasToken]);

  const currentGasBalance = useMemo(
    () =>
      utils.formatUnits(
        (tokensWithBalances?.find(t => t.tokenId === chosenGasToken)?.balance ??
          BigInt(0)) - (assetTotals[chosenGasToken] ?? BigInt(0)),
        tokensWithBalances?.find(t => t.tokenId === chosenGasToken)?.decimals
      ),
    [tokensWithBalances, chosenGasToken, assetTotals]
  );

  const isInsufficientBalance = useMemo(() => {
    return currentGasBalance <= gasFee;
  }, [currentGasBalance, gasFee]);

  return (
    <Dialog open={showSignatureModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] backdrop-blur-[6px] justify-between items-center p-4 bg-mutedOpacity bg-opacity-60 rounded-lg">
        <DialogHeader>
          <DialogTitle>Transaction Confirmation</DialogTitle>
          <DialogDescription>
            Sign signature request from your MetaMask wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 ">
          <div>
            <div className="text-sm mb-2">Transaction Information:</div>
            <div className="grid grid-cols-1 items-center gap-4 py-2 border-[1px] border-sendy backdrop-blur-[6px] justify-between  bg-mutedOpacity bg-opacity-80 rounded-lg ">
              <div className="grid grid-cols-1 overflow-scroll px-2 max-h-60 w-full h-full scroll-5">
                {txPayload ? <TxPayload txPayload={txPayload} /> : 'No payload'}
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm mb-2">
              This message will be encoded into:
            </div>
            <div className="grid grid-cols-1 items-center gap-4 font-sans text-sm">
              <div className=" border-[1px] border-sendy backdrop-blur-[6px] justify-between items-center p-2 bg-mutedOpacity bg-opacity-80 rounded-lg">
                <div className="break-all whitespace-break-spaces text-sm pre leading-none p-2 pr-0 bg-gray-100  rounded-lg mb-2 last-of-type:mb-0 text-primary dark:text-secondary font-mono">
                  {encodedMessage}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center w-full mt-3 mb-3">
          <div className="text-sm leading-none">
            Estimated
            <br />
            gas fee
          </div>
          <div
            className={`text-3xl ${isInsufficientBalance ? 'text-red-600' : ''} font-bold`}
          >
            {gasFee}
          </div>
        </div>
        {isInsufficientBalance && (
          <div className="flex flex-row w-full text-center text-red-600">
            <div>
              You do not have enough {gasTokenName} {currentGasBalance} to cover
              gas fee {gasFee}
            </div>
          </div>
        )}
        <DialogFooter className="">
          <div className="flex flex-row justify-between items-center w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose()}
              disabled={isPending}
            >
              Cancel
            </Button>
            {!isInsufficientBalance && (
              <Button
                onClick={() => !isInsufficientBalance && onContinue()}
                disabled={isPending ?? isInsufficientBalance}
                className={`bg-primary dark:bg-sendy ${isInsufficientBalance}`}
              >
                Continue
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureConfirmModal;
