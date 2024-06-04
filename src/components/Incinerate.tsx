'use client';

import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAccountProvider } from '@/Providers/AccountProvider';
import useDebounce from '@/hooks/useDebounce';
import { useGetCollectionTokens } from '@/hooks/useGetCollectionTokens';
import { useTrnApi } from '@/Providers/TrnApiProvider';
import { useCreateBulkExtrinsic } from '@/hooks/useCreateBulkExtrinsic';
import CollectionIdOrAddress from './CollectionIdOrAddress';
import { addressToCollectionId } from '@/lib/utils';
import { env } from '@/env';
import { commonCollections } from '@/utils';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { useTxProvider } from '@/Providers/TxProvider';
import { useSendyProvider } from '@/Providers/SendyProvider';
import type { ExtrinsicArray } from '@/types';

export default function Incinerate() {
  const { rootApi } = useTrnApi();
  // const { data: walletData } = useWalletClient();

  const [collectionId, setCollectionId] = useState<string>('');
  const [showCommonCollections, setShowCommonCollections] = useState(false);

  const { setShowGasModal } = useTxProvider();
  const { activeAccount, account, futurePass } = useAccountProvider();
  const { BATCH_SIZE } = useSendyProvider();
  const debouncedCollectionId = useDebounce(collectionId, 500);
  const { submitExtrinsic } = useCreateBulkExtrinsic();

  const isAddress = useMemo(() => {
    if (debouncedCollectionId.startsWith('0x')) {
      return true;
    }
    return false;
  }, [debouncedCollectionId]);

  const collectionIdToUse = useMemo(() => {
    if (isAddress) {
      return addressToCollectionId(collectionId).toString();
    }
    return collectionId;
  }, [isAddress, collectionId]);

  const { data, isLoading, isFetching } = useGetCollectionTokens(
    rootApi,
    collectionIdToUse ?? '',
    activeAccount === 'eoa' ? account.toString() : (futurePass ?? '').toString()
  );

  const extrinsics = useMemo(() => {
    if (collectionIdToUse.startsWith('0x') || collectionIdToUse === '') {
      return [];
    }

    return (
      (data?.[2] as number[])?.map((token: number) => {
        return rootApi.tx.nft.burn([collectionIdToUse, token]);
      }) ?? []
    );
  }, [data, collectionIdToUse, rootApi.tx.nft]);

  const deadExtrinsics = useMemo(() => {
    if (
      collectionIdToUse.startsWith('0x') ||
      collectionIdToUse === '' ||
      !data ||
      (data?.[2] as number[]).length === 0
    ) {
      return null;
    }

    return [
      rootApi.tx.nft.transfer(
        collectionIdToUse,
        [...(data?.[2] as number[])],
        '0x000000000000000000000000000000000000dEaD'
      ),
    ];
  }, [data, collectionIdToUse, rootApi.tx.nft]);

  const tokenCount = useMemo(() => {
    return data?.[1]?.toString() ?? '0';
  }, [data]);

  type SubEx = typeof submitExtrinsic;

  const handleBurn = async ({
    submitExtrinsic,
    extrinsics,
  }: {
    submitExtrinsic: SubEx;
    extrinsics: ExtrinsicArray;
  }) => {
    if (extrinsics.length === 0) {
      return;
    }

    await submitExtrinsic({ extrinsics });
  };

  const handleTransfer = async ({
    submitExtrinsic,
    extrinsics,
  }: {
    submitExtrinsic: SubEx;
    extrinsics: ExtrinsicArray;
  }) => {
    if (extrinsics.length === 0 || !extrinsics) {
      return;
    }

    await submitExtrinsic({ extrinsics });
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-9">
        <h1
          className={`lg:col-span-8 lg:col-start-3 text-sendy text-[1.6rem] md:text-[2rem] text-start font-bold md:font-black leading-none mb-4`}
        >
          Incinerate Tokens
        </h1>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-9  relative z-20`}>
        <div
          className={`lg:col-span-8 lg:col-start-3 w-full backdrop-blur-[6px] justify-between items-center p-4 bg-mutedOpacity bg-opacity-60 rounded-lg mb-4`}
        >
          <div className="pb-2 inner text-foreground">
            <h2>Collection Id or Address</h2>
          </div>
          <div className="relative">
            <CollectionIdOrAddress
              value={collectionId.toString()}
              onChange={setCollectionId}
              disabled={isFetching || isLoading}
            />
            <div
              className="absolute top-0 right-0 -translate-x-2 translate-y-1/2 grid py-1 px-2 text-[9px] uppercase text-sendy tracking-wider cursor-pointer rounded-lg bg-muted hover:bg-sendy hover:text-background transition-all duration-300 ease-in-out"
              onClick={() => setShowCommonCollections(!showCommonCollections)}
            >
              COMMON COLLECTIONS
            </div>

            {showCommonCollections && (
              <div className="absolute bottom-0 right-2 translate-y-full z-50">
                <ScrollArea
                  className="h-72 w-48 0 bg-background border border-muted dark:border-sendy rounded-md"
                  onMouseLeave={() => setShowCommonCollections(false)}
                >
                  <div className="">
                    {commonCollections?.[env.NEXT_PUBLIC_NETWORK]?.map(
                      collection => (
                        <React.Fragment
                          key={`incinerate-wrapper-${collection.collectionId}`}
                        >
                          <div
                            key={`incinerate-token-${collection.collectionId}`}
                            className="px-2 py-4 text-xs cursor-pointer hover:bg-muted dark:hover:bg-sendy hover:text-background transition-all duration-300 ease-in-out"
                            onClick={() => {
                              setCollectionId(
                                collection.collectionId.toString()
                              );
                              setShowCommonCollections(false);
                            }}
                          >
                            {collection.collectionName} (
                            {collection.collectionId})
                          </div>

                          <Separator
                            className=""
                            key={`seperator-incinerate-${collection.collectionId}`}
                          />
                        </React.Fragment>
                      )
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </div>
      {isFetching && (
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-9  relative z-20`}
        >
          <div
            className={`lg:col-span-8 lg:col-start-3 w-full backdrop-blur-[6px] justify-between items-center p-4 bg-mutedOpacity bg-opacity-60 rounded-lg mb-4 text-foreground`}
          >
            Fetching...
          </div>
        </div>
      )}
      {!isFetching &&
        !isLoading &&
        (parseInt(tokenCount) > 0 ||
          (collectionId !== '' && parseInt(tokenCount) === 0)) && (
          <div
            className={`grid grid-cols-1 lg:grid-cols-12 gap-9  relative z-10`}
          >
            <div
              className={`lg:col-span-8 lg:col-start-3 w-full backdrop-blur-[6px] justify-between items-center p-4 bg-mutedOpacity bg-opacity-60 rounded-lg mb-4`}
            >
              {parseInt(tokenCount) > 0 && (
                <>
                  <div className="p-2 inner text-center mb-3 text-foreground">
                    <h2 className="text-2xl font-bold">
                      We found {tokenCount} tokens to burn!{' '}
                    </h2>
                    {parseInt(tokenCount) > BATCH_SIZE ? (
                      <h4 className="mt-3 text-lg font-semibold">
                        Ready to burn/transfer the first {BATCH_SIZE} tokens?
                      </h4>
                    ) : (
                      <h4 className="mt-3 text-lg font-semibold">
                        Ready to burn/transfer?
                      </h4>
                    )}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 w-full items-center ">
                    <div className="grid grid-cols-4">
                      <Button
                        type="submit"
                        onClick={() =>
                          handleBurn({ submitExtrinsic, extrinsics })
                        }
                        className="dark:bg-sendyOpacity hover:bg-opacity-40 dark:hover:bg-opacity-40  transition-all duration-300 w-full rounded-tr-none rounded-br-none col-span-3 "
                        disabled={extrinsics.length === 0}
                      >
                        Burn Tokens
                      </Button>
                      <Button
                        className="dark:bg-sendyOpacity bg-sendyOpacity dark:bg-opacity-20 bg-opacity-20 hover:bg-opacity-40 dark:hover:bg-opacity-40 text-white hover:text-white transition-all duration-300 w-full rounded-tl-none rounded-bl-none "
                        onClick={() => setShowGasModal(true)}
                      >
                        {/* <EllipsisVertical /> */}
                        <span className="text-xs uppercase ">Gas</span>
                      </Button>
                    </div>

                    {deadExtrinsics && deadExtrinsics.length > 0 && (
                      <div className="grid grid-cols-4">
                        <Button
                          type="submit"
                          onClick={() =>
                            handleTransfer({
                              submitExtrinsic,
                              extrinsics: deadExtrinsics,
                            })
                          }
                          className="dark:bg-sendyOpacity hover:bg-opacity-40 dark:hover:bg-opacity-40  transition-all duration-300 w-full rounded-tr-none rounded-br-none col-span-3 "
                          disabled={extrinsics.length === 0}
                        >
                          Transfer To Dead Address
                        </Button>
                        <Button
                          className="dark:bg-sendyOpacity bg-sendyOpacity dark:bg-opacity-20 bg-opacity-20 hover:bg-opacity-40 dark:hover:bg-opacity-40 text-white hover:text-white transition-all duration-300 w-full rounded-tl-none rounded-bl-none "
                          onClick={() => setShowGasModal(true)}
                        >
                          {/* <EllipsisVertical /> */}
                          <span className="text-xs uppercase ">Gas</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
              {collectionId !== '' && parseInt(tokenCount) === 0 && (
                <div className="py-2 inner">
                  <h2>Sorry, we did not find any tokens to burn </h2>
                </div>
              )}
            </div>
          </div>
        )}
    </>
  );
}
