import { useTrnApi } from '@/Providers/TrnApiProvider';
import CollectionIdOrAddress from './CollectionIdOrAddress';
import NftTokenSelector from './NftTokenSelector';
import { useAccountProvider } from '@/Providers/AccountProvider';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { type Option, useDebounce } from './ui/multiple-selector';
import { addressToCollectionId } from '@/lib/utils';
import { useGetCollectionTokensWithCollectionInfo } from '@/hooks/useGetCollectionTokensWithCollectionInfo';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { utils } from 'ethers';

import { Checkbox } from './ui/checkbox';
import { commonCollections } from '@/utils';
import { env } from '@/env';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { RecentAddresses } from './RecentAddresses';
import { useSendyProvider } from '@/Providers/SendyProvider';
import type { Sendy } from '@/types';
import { useRnsResolveRns } from '@/hooks/useRns';
import ImageSelector from './ImageSelector';

export default function SendyNft() {
  return (
    <div className="">
      <SendyNftInput />
    </div>
  );
}

const SendyNftInput = () => {
  const {
    batchedSendys,
    setBatchedSendys,
    selectedCollectionId,
    setSelectedCollectionId,
    setSelectedCollectionName,
    setSelectedCollectionMetadata,
    selectedPairs,
    setSelectedPairs,
    addRecentlyUsedAddress,
    recentlyUsedAddresses,
    addRecentlyUsedCollection,
    recentlyUsedCollection,
  } = useSendyProvider();

  const { rootApi } = useTrnApi();

  const [showImages, setShowImages] = useState(false);

  const [values, setValues] = useState<Array<Option>>([]);
  const [collectionId, setCollectionId] = useState<string>(
    selectedCollectionId.toString()
  );
  const [addressToSend, setAddressToSend] = useState<string>('');

  const { activeAccount, account, futurePass } = useAccountProvider();
  const debouncedCollectionId = useDebounce(collectionId, 500);

  const { data: resolvedAddy, isFetching: rnsFetching } =
    useRnsResolveRns(addressToSend);

  const debouchedAddressToSend = useDebounce(
    resolvedAddy ?? addressToSend,
    500
  );

  const [reset, setReset] = useState(false);
  const [showCommonCollections, setShowCommonCollections] = useState(false);
  const [showRecentAddresses, setShowRecentAddresses] = useState(false);

  const isAddress = useMemo(() => {
    if (debouncedCollectionId.startsWith('0x')) {
      return true;
    }
    return false;
  }, [debouncedCollectionId]);

  const collectionIdToUse = useMemo(() => {
    if (isAddress) {
      const col = addressToCollectionId(collectionId);
      setSelectedCollectionId(col);
      return col.toString();
    }
    setSelectedCollectionId(parseInt(collectionId));
    return collectionId;
  }, [isAddress, setSelectedCollectionId, collectionId]);

  const { data, isLoading, isFetching } =
    useGetCollectionTokensWithCollectionInfo(
      rootApi,
      collectionIdToUse ?? '',
      activeAccount === 'eoa'
        ? account.toString()
        : (futurePass ?? '').toString()
    );

  const tokens = useMemo(() => {
    if (!data) {
      return [];
    }
    const t =
      (data?.tokens?.[2] as number[])?.map((token: number) => {
        return {
          id: token,
        };
      }) ?? [];

    const filteredT = t.filter(
      t =>
        !selectedPairs.find(
          p => p.collectionId === collectionIdToUse && p.tokenId === t.id
        )
    );

    return filteredT;
  }, [data, selectedPairs, collectionIdToUse]);

  const collectionName = useMemo(() => {
    if (!data) {
      return '';
    }

    const colName = data?.collectionInfo?.name?.toString() ?? '';
    setSelectedCollectionName(colName);
    return colName;
  }, [data, setSelectedCollectionName]);

  const collectionMetadata = useMemo(() => {
    if (!data) {
      return '';
    }

    const colMetadata = data?.collectionInfo?.tokenUri?.toString() ?? '';
    setSelectedCollectionMetadata(colMetadata);
    return colMetadata;
  }, [data, setSelectedCollectionMetadata]);

  const handleAddTransaction = () => {
    if (
      !collectionIdToUse ||
      !addressToSend ||
      values.length === 0 ||
      !rootApi
    ) {
      return;
    }

    const extrinsic = rootApi.tx.nft.transfer(
      collectionIdToUse,
      values.map(v => parseInt(v.value)),
      debouchedAddressToSend
    );

    const sendy: Sendy = {
      addedId: batchedSendys.length + 1,
      collectionId: collectionIdToUse,
      collectionName: collectionName,
      tokenIds: values.map(v => parseInt(v.value)),
      address: debouchedAddressToSend,
      extrinsic,
      isTip: false,
    };

    addRecentlyUsedAddress(debouchedAddressToSend);

    // Check if the collection is in the common collections list, if not add it to the recently used collections
    if (
      !commonCollections?.[env.NEXT_PUBLIC_NETWORK]?.find(
        cc => cc.collectionId.toString() === collectionIdToUse
      )
    ) {
      addRecentlyUsedCollection(collectionIdToUse);
    }

    //@ts-expect-error - Typing issue
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return
    setBatchedSendys((prev: BatchedSendys) => [...prev, sendy]);

    const newPairs = values.map(v => ({
      collectionId: collectionIdToUse,
      tokenId: parseInt(v.value),
    }));
    setSelectedPairs([...selectedPairs, ...newPairs]);

    if (reset) {
      setValues([]);
      setCollectionId('');
      setAddressToSend('');
    } else {
      setValues([]);
    }
  };

  const handleAddressChange = useCallback(async (address: string) => {
    setAddressToSend(address);
    if (address === '') {
      setAddressToSend('');
    }
    return;
  }, []);

  const handleAddressInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;

    await handleAddressChange(address);
  };

  const isValidAddress = useMemo(() => {
    if (!debouchedAddressToSend) {
      return false;
    }

    try {
      return utils.getAddress(debouchedAddressToSend);
    } catch (error) {
      return false;
    }
  }, [debouchedAddressToSend]);

  return (
    <div className="grid grid-cols-1 gap-3 p-3 backdrop-blur-[6px] justify-between items-center bg-mutedOpacity bg-opacity-60 rounded-lg w-full z-20 relative ">
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
                            setCollectionId(collection.collectionId.toString());
                            setShowCommonCollections(false);
                          }}
                        >
                          {collection.collectionName} ({collection.collectionId}
                          )
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
      {collectionIdToUse &&
        tokens.length === 0 &&
        !isLoading &&
        !isFetching && (
          <div className="text-foreground">
            <div className="p-2 bg-muted w-full rounded-md">
              No tokens found in wallet
            </div>
          </div>
        )}
      {tokens &&
        tokens.length > 0 &&
        (showImages ? (
          <>
            <div className="text-foreground">
              <>
                <div className="pb-2 inner flex flex-row justify-between">
                  <h2>Select token ids to send from {collectionName}</h2>
                  <div
                    onClick={() => setShowImages(false)}
                    className="leading-0 flex py-1 px-2 text-[9px] uppercase text-sendy tracking-wider cursor-pointer rounded-lg bg-muted hover:bg-sendy hover:text-background transition-all duration-300 ease-in-out"
                  >
                    Add By List
                  </div>
                </div>
                <ImageSelector
                  tokens={tokens}
                  metadataUrl={collectionMetadata}
                  values={values}
                  setValues={setValues}
                />
              </>
            </div>
          </>
        ) : (
          <div className="text-foreground">
            <>
              <div className="pb-2 inner flex flex-row justify-between">
                <h2>Select token ids to send from {collectionName}</h2>
                <div
                  onClick={() => setShowImages(true)}
                  className="leading-0 flex py-1 px-2 text-[9px] uppercase text-sendy tracking-wider cursor-pointer rounded-lg bg-muted hover:bg-sendy hover:text-background transition-all duration-300 ease-in-out"
                >
                  Add By Image
                </div>
              </div>
              <NftTokenSelector
                placeholder="Select Token Ids"
                options={tokens.map(t => {
                  return {
                    value: t.id.toString(),
                    label: t.id,
                  } as unknown as Option;
                })}
                values={values}
                setValues={setValues}
              />
            </>
          </div>
        ))}
      {values && values.length > 0 && (
        <div className="text-foreground">
          <div className="pb-2 inner">
            <h2>Address To Send Tokens</h2>
          </div>
          <div className="relative">
            <Input
              type="text"
              className="text-[16px] md:text-sm"
              placeholder="Wallet Address"
              value={addressToSend ?? ''}
              onChange={e => handleAddressInput(e)}
              autoComplete="off"
            />
            {recentlyUsedAddresses && recentlyUsedAddresses.length > 0 && (
              <div
                className="absolute -top-[2px] right-0 -translate-x-2 translate-y-1/2 grid py-1 px-2 text-[9px] uppercase text-sendy tracking-wider cursor-pointer rounded-lg bg-muted hover:bg-sendy hover:text-background transition-all duration-300 ease-in-out"
                onClick={() => setShowRecentAddresses(!showRecentAddresses)}
              >
                RECENT ADDRESSES
              </div>
            )}
            {showRecentAddresses &&
              recentlyUsedAddresses &&
              recentlyUsedAddresses.length > 0 && (
                <RecentAddresses
                  setAddressToSend={setAddressToSend}
                  setShowRecentAddresses={setShowRecentAddresses}
                  handleAddressChange={handleAddressChange}
                />
              )}
          </div>
        </div>
      )}
      {rnsFetching && (
        <div className="text-xs text-foreground">Checking Address</div>
      )}
      {values && values.length > 0 && resolvedAddy && !rnsFetching ? (
        <div className="text-xs text-foreground">
          Resolved Address: {resolvedAddy}
        </div>
      ) : null}
      {debouchedAddressToSend &&
        isValidAddress &&
        values &&
        values.length > 0 && (
          <div className="">
            <div className="pb-2 mt-2 flex items-center space-x-2">
              <Checkbox
                id="reset"
                checked={reset}
                onCheckedChange={() => setReset(!reset)}
              />
              <label
                htmlFor="reset"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Reset Form on Add
              </label>
            </div>
            <div className="mt-2">
              <Button
                className="w-full dark:bg-sendyOpacity hover:bg-opacity-40 dark:hover:bg-opacity-40 transition-all duration-300 uppercase text-xs tracking-wider"
                onClick={() => handleAddTransaction()}
              >
                Add Transfer
              </Button>
            </div>
          </div>
        )}
    </div>
  );
};
