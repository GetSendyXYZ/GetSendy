/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useSendyProvider } from '@/Providers/SendyProvider';
import { shortenAddress } from '@/utils';
import React, { useCallback, useMemo, useState } from 'react';
import TransferToken from './assets/Transfer';
import TransferNft from './nft/Transfer';
import { AnimatePresence, type DragControls, motion } from 'framer-motion';
import { env } from '@/env';
import { utils } from 'ethers';
import { useAccountProvider } from '@/Providers/AccountProvider';
import type { BatchedSendys, Sendy } from '@/types';
import { useRnsResolveAddress } from '@/hooks/useRns';

export default function TransactionData({
  sendy,
  index,
  dragControls,
}: {
  sendy: Sendy;
  index: number;
  dragControls: DragControls;
}) {
  const {
    setBatchedSendys,
    setTipAdded,
    setAssetTotals,
    selectedPairs,
    setSelectedPairs,
  } = useSendyProvider();
  const [toggleOpen, setToggleOpen] = useState(false);
  const { tokensWithBalances } = useAccountProvider();

  const handleRemove = useCallback(() => {
    if (
      sendy.address.toLowerCase() ===
      env.NEXT_PUBLIC_TIP_TOKEN_ADDRESS.toLowerCase()
    ) {
      setTipAdded(false);
    }

    //@ts-expect-error - TS is not able to infer the type of the method
    setAssetTotals(prev => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const newTotals = { ...prev };
      const decimals = tokensWithBalances?.find(
        t => t.tokenId === sendy.assetId ?? 0
      )?.decimals;

      if (!decimals || !sendy?.assetId) {
        return (newTotals ?? {}) as Record<number, bigint>;
      }

      newTotals[sendy?.assetId] -= utils
        .parseUnits(sendy?.amountToSend?.toString() ?? '0', decimals)
        .toBigInt();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return newTotals;
    });

    if (selectedPairs && selectedPairs.length > 0) {
      let newSelectedPairs = [...selectedPairs];
      const collectionId = sendy.collectionId;
      const tokenIds = sendy.tokenIds;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      newSelectedPairs = newSelectedPairs
        .filter(p => p.collectionId === collectionId)
        .filter(
          (p: { collectionId: string; tokenId: number }) =>
            !tokenIds?.includes(p.tokenId)
        );

      setSelectedPairs(
        newSelectedPairs as { collectionId: string; tokenId: number }[]
      );
    }

    setBatchedSendys(
      //@ts-expect-error - TS is not able to infer the type of the method
      (prev: BatchedSendys) =>
        prev.filter(b => b.addedId !== sendy.addedId) as BatchedSendys
    );
  }, [
    selectedPairs,
    sendy.addedId,
    sendy.address,
    sendy?.amountToSend,
    sendy.assetId,
    sendy.collectionId,
    sendy.tokenIds,
    setAssetTotals,
    setBatchedSendys,
    setSelectedPairs,
    setTipAdded,
    tokensWithBalances,
  ]);

  // const [toggleOpen, setToggleOpen] = React.useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const method: string = useMemo(() => {
    //@ts-expect-error - TS is not able to infer the type of the method
    const { method } = sendy.extrinsic.toHuman();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return method;
  }, [sendy]);

  const TransactionComponents = useMemo(
    () => ({
      assets: {
        transfer: <TransferToken toggleOpen={toggleOpen} sendy={sendy} />,
        transferKeepAlive: (
          <TransferToken toggleOpen={toggleOpen} sendy={sendy} />
        ),
      },
      balances: {
        transfer: <TransferToken toggleOpen={toggleOpen} sendy={sendy} />,
        transferKeepAlive: (
          <TransferToken toggleOpen={toggleOpen} sendy={sendy} />
        ),
      },
      nft: {
        transfer: <TransferNft toggleOpen={toggleOpen} sendy={sendy} />,
      },
    }),
    [sendy, toggleOpen]
  );

  const { data: rnsAddress, isFetching } = useRnsResolveAddress(sendy.address);

  return (
    <motion.div
      layout="position"
      className={`relative grid grid-cols-1 backdrop-blur-[6px] justify-between items-start p-2 border-[1px] border-sendy border-opacity-25 ${!sendy.isTip ? 'bg-mutedOpacity ' : 'bg-sendyOpacity '} bg-opacity-30 rounded-lg w-full z-10 mt-3 `}
      onClick={() => setToggleOpen(!toggleOpen)}
    >
      <div className="flex flex-row flex-nowrap -mb-4 -mt-2 -ml-2 -mr-2 w-[calc(100% + 4rem)] justify-stretch z-10">
        <div
          className="bg-red-900 font-bold text-white  grid justify-center items-center rounded-tl-lg text-[9px] tracking-widest uppercase p-1 pr-2 pl-2"
          onClick={e => {
            e.stopPropagation();
            handleRemove();
          }}
        >
          Remove
        </div>
        <div
          className=" font-bold text-foreground bg-muted flex-grow flex-shrink text-[9px] tracking-widest uppercase p-1 pr-2 pl-2 text-center cursor-move"
          onPointerDown={event => dragControls.start(event)}
          onClick={e => e.stopPropagation()}
        >
          DRAG TO REORDER
        </div>
        <div className="bg-sendy font-bold text-secondary  grid justify-center items-center rounded-tr-lg text-[9px] tracking-widest uppercase p-1 pr-2 pl-2">
          Transaction {index + 1}
        </div>
      </div>
      <div className="toggleWrap relative z-[5]">
        <div
          className={`inner-toggle open w-full pt-6 grid ${toggleOpen ? 'grid-cols-1 gap-2' : 'grid-cols-12 gap-1'}  overflow-hidden`}
        >
          <AnimatePresence>
            {
              //@ts-expect-error - TS is not able to infer the type of the method
              (
                TransactionComponents as {
                  assets: {
                    transfer: React.ReactElement;
                    transferKeepAlive: React.ReactElement;
                  };
                  balances: {
                    transfer: React.ReactElement;
                    transferKeepAlive: React.ReactElement;
                  };
                  nft: {
                    transfer: React.ReactElement;
                  };
                }
              )?.[
                (
                  method as { section?: string; method?: string }
                ).section?.toString() ?? 'balances'
              ]?.[
                (
                  method as { section?: string; method?: string }
                ).method?.toString() ?? 'transfer'
              ]
            }
            <motion.div
              className={`${toggleOpen ? 'col-span-1' : 'col-span-5'}`}
              layout="position"
              key="col-addy"
            >
              <div className="mb-1 text-[10px] uppercase tracking-widest font-bold">
                Address
              </div>
              <div
                className={`p-2 bg-muted w-full rounded-md font-mono text-xs whitespace-nowrap ${toggleOpen ? 'overflow-auto' : 'overflow-scroll'} scroll-bar-gutter scroll-pb-5`}
              >
                {!isFetching && rnsAddress
                  ? `${rnsAddress} (${shortenAddress(sendy.address)})`
                  : shortenAddress(sendy.address)}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
