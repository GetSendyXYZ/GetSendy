import React, { useMemo } from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';

import { TxStatus, useTxProvider } from '@/Providers/TxProvider';
import { env } from '@/env';
import Image from 'next/image';

const baseUrl =
  env.NEXT_PUBLIC_NETWORK === 'porcini'
    ? 'https://porcini.rootscan.io/extrinsics/'
    : 'https://rootscan.io/extrinsics/';

const TxModal: React.FC = () => {
  const {
    showTxModal,
    setShowTxModal,
    txStatus,
    txError,
    extrinsicId,
    encodedMessage,
  } = useTxProvider();

  const explorerUrl = useMemo(() => {
    return `${baseUrl}${extrinsicId}`;
  }, [extrinsicId]);

  const randomNumber = useMemo(() => {
    if (!showTxModal) return null;
    return Math.floor(Math.random() * 6) + 1;
  }, [showTxModal]);

  return (
    <Dialog open={showTxModal} onOpenChange={setShowTxModal}>
      <DialogContent
        className={`sm:max-w-[425px] backdrop-blur-[6px] justify-between items-center p-4 bg-mutedOpacity bg-opacity-60 rounded-lg grid grid-cols-1 w-full ${txStatus === TxStatus.Processing ? 'tx-processing' : ''}`}
      >
        {txStatus === TxStatus.Pending && (
          <div className="text-center pending w-full grid grid-cols-1 justify-center items-center p-2">
            <div className="w-full text-center mb-2 font-black text-2xl">
              Sign Message In Wallet
            </div>
            <div className=" border-[1px] border-sendy backdrop-blur-[6px] justify-between items-center p-2 bg-mutedOpacity bg-opacity-80 rounded-lg">
              <div className="break-all whitespace-break-spaces text-sm pre leading-none p-2 pr-0 bg-gray-100  rounded-lg mb-2 last-of-type:mb-0 text-primary dark:text-secondary font-mono">
                {encodedMessage}
              </div>
            </div>
          </div>
        )}

        {txStatus === TxStatus.Processing && (
          <div className="text-center processing w-full grid grid-cols-1 justify-center items-center p-2">
            <div className="text-center mb-2 font-black text-2xl  ">
              Transaction Processing
            </div>
            <div className="text-center processing w-full grid grid-cols-1 justify-center items-center p-2">
              <Image
                src="/images/processing.webp"
                width={100}
                height={100}
                className="w-full"
                alt="Transaction Processing"
              />
            </div>
            <div className="text-center text-sm mt-2">SEND IT FAM...</div>
          </div>
        )}

        {txStatus === TxStatus.Failed && (
          <div className="text-center failed w-full grid grid-cols-1 justify-center items-center">
            <div className="text-center mb-2 font-black text-2xl">
              Transaction Failed
            </div>
            <div className="text-center processing w-full grid grid-cols-1 justify-center items-center p-2">
              {randomNumber !== null && (
                <Image
                  src={`/images/fail-${randomNumber}.gif`}
                  width={100}
                  height={100}
                  className="w-full"
                  alt="Transaction Failed"
                />
              )}
              {txError && <div className="text-center">{txError}</div>}
            </div>
          </div>
        )}

        {txStatus === TxStatus.Success && (
          <div className="text-center success w-full grid grid-cols-1 justify-center items-center">
            <div className="text-center mb-2 font-black text-2xl  ">
              Transaction Successful
            </div>
            <div className="text-center processing w-full grid grid-cols-1 justify-center items-center p-2">
              {randomNumber !== null && (
                <Image
                  src={`/images/success-${randomNumber}.webp`}
                  width={100}
                  height={100}
                  className="w-full"
                  alt="Transaction Successful"
                />
              )}
            </div>
            {extrinsicId && (
              <div className="text-center text-sm mt-2">
                Extrinsic Id: {extrinsicId}{' '}
              </div>
            )}
            {extrinsicId && (
              <div className="text-center mb-2 mt-2 relative">
                <a
                  href={explorerUrl}
                  target="_blank"
                  className="underline text-primary dark:text-sendy font-bold"
                >
                  View Transaction in Explorer
                </a>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TxModal;
