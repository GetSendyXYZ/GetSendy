import { useCollectionId } from '@/hooks/useCollectionId';
import { useAccountProvider } from '@/Providers/AccountProvider';
import { useSendyProvider } from '@/Providers/SendyProvider';
import { SendyProcess } from '@/types';
import { useTrnApi } from '@/Providers/TrnApiProvider';
import React, { Fragment, useEffect, useState } from 'react';
import { useDebounce } from './ui/multiple-selector';
import { useGetCollectionTokensWithCollectionInfo } from '@/hooks/useGetCollectionTokensWithCollectionInfo';
import { useCollectionInfo } from '@/hooks/useCollectionInfo';
import CollectionIdOrAddress from './CollectionIdOrAddress';

import { commonCollections } from '@/utils';
import { env } from '@/env';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

export default function CollectionsWithRecentAndCommon() {
  const { activeAccount, account, futurePass } = useAccountProvider();

  const {
    selectedCollectionId,
    setSelectedCollectionName,
    setSelectedCollectionMetadata,
    recentlyUsedCollection,
    setCurrentSendyProcess,
  } = useSendyProvider();

  const [showLoader, setShowLoader] = useState(false);
  const [showCommonCollections, setShowCommonCollections] = useState(false);
  const { rootApi } = useTrnApi();

  const [collectionId, setCollectionId] = useState<string>(
    selectedCollectionId.toString()
  );

  useEffect(() => {
    setCollectionId(selectedCollectionId.toString());
  }, [selectedCollectionId]);

  const debouncedCollectionId = useDebounce(collectionId, 500);
  const collectionIdToUse = useCollectionId(debouncedCollectionId);

  useEffect(() => {
    if (!selectedCollectionId) {
      setCurrentSendyProcess(SendyProcess.StageOne);
    } else {
      setCurrentSendyProcess(SendyProcess.StageTwo);
    }
  }, [selectedCollectionId, setCurrentSendyProcess]);

  const collectionData = useGetCollectionTokensWithCollectionInfo(
    rootApi,
    collectionIdToUse ?? '',
    activeAccount === 'eoa' ? account.toString() : (futurePass ?? '').toString()
  );

  const { isLoading, isFetching } = collectionData;
  const { collectionName, collectionMetadata } =
    useCollectionInfo(collectionData);

  setSelectedCollectionName(collectionName);
  setSelectedCollectionMetadata(collectionMetadata);

  useEffect(() => {
    if (!isFetching) {
      setShowLoader(false);
    }
  }, [isFetching]);

  console.log('isFetching, showLoader', isFetching, showLoader);

  return (
    <div className="text-foreground">
      <div className="pb-2 inner">
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

        {(isFetching || showLoader) && (
          <div className="absolute top-[-2px] right-[8rem] -translate-x-2 translate-y-1/2 grid py-1 px-2 text-[9px] uppercase text-sendy tracking-wider cursor-pointer rounded-lg bg-transparent hover:bg-sendy hover:text-background transition-all duration-300 ease-in-out">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-sendy"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}

        {showCommonCollections && (
          <div className="absolute bottom-0 right-2 translate-y-full z-50">
            <ScrollArea
              className="h-72 w-48 0 bg-background border border-muted dark:border-sendy rounded-md"
              onMouseLeave={() => setShowCommonCollections(false)}
            >
              <div className="">
                {commonCollections?.[env.NEXT_PUBLIC_NETWORK]?.map(
                  (collection, i) => (
                    <Fragment key={`common-collection-${i}`}>
                      <div
                        className="px-2 py-4 text-xs cursor-pointer hover:bg-muted dark:hover:bg-sendy hover:text-background transition-all duration-300 ease-in-out"
                        onClick={() => {
                          collection.collectionId.toString() !==
                            collectionIdToUse && setShowLoader(true);
                          setCollectionId(collection.collectionId.toString());
                          setShowCommonCollections(false);
                        }}
                      >
                        {collection.collectionName} ({collection.collectionId})
                      </div>
                      <Separator className="" />
                    </Fragment>
                  )
                )}
                {recentlyUsedCollection?.map((collection, i) => (
                  <Fragment key={`recent-collection-${i}`}>
                    <div
                      className="px-2 py-4 text-xs cursor-pointer hover:bg-muted dark:hover:bg-sendy hover:text-background transition-all duration-300 ease-in-out"
                      onClick={() => {
                        collection.toString() !== collectionIdToUse &&
                          setShowLoader(true);
                        setCollectionId(collection);
                        setShowCommonCollections(false);
                      }}
                    >
                      {collection}
                    </div>
                    <Separator className="" />
                  </Fragment>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
