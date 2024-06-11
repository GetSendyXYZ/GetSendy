import { type Dispatch, type SetStateAction, useState } from 'react';
import { type Option } from './ui/multiple-selector';
import { useSendyProvider } from '@/Providers/SendyProvider';
import { useTrnApi } from '@/Providers/TrnApiProvider';
import { commonCollections } from '@/utils';
import { env } from '@/env';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import ImageSelector from './ImageSelector';
import NftTokenSelector from './NftTokenSelector';
import CollectionsWithRecentAndCommon from './CollectionsWithRecentAndCommon';
import type { Sendy } from '@/types';
import { RecentAddresses } from './RecentAddresses';
import useCollectionData from '@/hooks/useCollectionData';
import useAddress from '@/hooks/useAddress';

export default function SendyNft() {
  return (
    <div className="">
      <SendyNftInput />
    </div>
  );
}

const SendyNftInput = () => {
  const { rootApi } = useTrnApi();
  const {
    batchedSendys,
    setBatchedSendys,
    selectedCollectionId,
    setSelectedCollectionId,
    selectedPairs,
    setSelectedPairs,
    addRecentlyUsedAddress,
    recentlyUsedAddresses,
    addRecentlyUsedCollection,
  } = useSendyProvider();

  const {
    setCollectionId,
    collectionIdToUse,
    collectionName,
    collectionMetadata,
    tokens,
    isLoading,
    isFetching,
  } = useCollectionData(selectedCollectionId.toString());

  const {
    addressToSend,
    setAddressToSend,
    debouncedAddressToSend,
    resolvedAddy,
    rnsFetching,
    handleAddressChange,
    isValidAddress,
  } = useAddress();

  const [showImages, setShowImages] = useState(false);
  const [values, setValues] = useState<Array<Option>>([]);
  const [reset, setReset] = useState(false);
  const [showRecentAddresses, setShowRecentAddresses] = useState(false);

  const handleAddTransaction = () => {
    if (!collectionIdToUse || !addressToSend || values.length === 0) return;

    const extrinsic = rootApi.tx.nft.transfer(
      collectionIdToUse,
      values.map(v => parseInt(v.value)),
      debouncedAddressToSend
    );
    const sendy: Sendy = {
      addedId: batchedSendys.length + 1,
      collectionId: collectionIdToUse,
      collectionName,
      tokenIds: values.map(v => parseInt(v.value)),
      address: debouncedAddressToSend,
      extrinsic,
      isTip: false,
    };

    addRecentlyUsedAddress(debouncedAddressToSend);
    if (
      !commonCollections[env.NEXT_PUBLIC_NETWORK]?.some(
        cc => cc.collectionId.toString() === collectionIdToUse
      )
    ) {
      addRecentlyUsedCollection(collectionIdToUse);
    }

    // @ts-expect-error - type issue
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return
    setBatchedSendys(prev => [...prev, sendy]);

    const newPairs = values.map(v => ({
      collectionId: collectionIdToUse,
      tokenId: parseInt(v.value),
    }));
    setSelectedPairs([...selectedPairs, ...newPairs]);

    if (reset) {
      setValues([]);
      setCollectionId('');
      setAddressToSend('');
      setSelectedCollectionId(0);
    } else {
      setValues([]);
    }
  };

  const handleAddressInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleAddressChange(e.target.value);
  };

  return (
    <div className="grid grid-cols-1 gap-3 p-3 backdrop-blur-[6px] justify-between items-center bg-mutedOpacity bg-opacity-60 rounded-lg w-full z-20 relative ">
      <CollectionsWithRecentAndCommon />

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

      {tokens.length > 0 && (
        <div className="text-foreground">
          <SendyNftHeader
            collectionName={collectionName}
            showImages={showImages}
            setShowImages={setShowImages}
          />

          <TokenSelector
            showImages={showImages}
            tokens={tokens}
            collectionMetadata={collectionMetadata}
            values={values}
            setValues={setValues}
          />
        </div>
      )}

      {values.length > 0 && (
        <AddressInput
          addressToSend={addressToSend}
          handleAddressInput={handleAddressInput}
          recentlyUsedAddresses={recentlyUsedAddresses}
          showRecentAddresses={showRecentAddresses}
          setShowRecentAddresses={setShowRecentAddresses}
          handleAddressChange={handleAddressChange}
          setAddressToSend={setAddressToSend}
        />
      )}

      {rnsFetching && (
        <div className="text-xs text-foreground">Checking Address</div>
      )}

      {values.length > 0 && resolvedAddy && !rnsFetching && (
        <div className="text-xs text-foreground">
          Resolved Address: {resolvedAddy}
        </div>
      )}

      {debouncedAddressToSend && isValidAddress && values.length > 0 && (
        <div>
          <ActionButtons
            reset={reset}
            setReset={setReset}
            handleAddTransaction={handleAddTransaction}
          />
        </div>
      )}
    </div>
  );
};

const SendyNftHeader = ({
  collectionName,
  showImages,
  setShowImages,
}: {
  collectionName: string;
  showImages: boolean;
  setShowImages: Dispatch<SetStateAction<boolean>>;
}) => (
  <div className="pb-2 inner flex flex-row justify-between">
    <h2>Select token ids to send from {collectionName}</h2>
    <div
      onClick={() => setShowImages(!showImages)}
      className="leading-0 flex py-1 px-2 text-[9px] uppercase text-sendy tracking-wider cursor-pointer rounded-lg bg-muted hover:bg-sendy hover:text-background transition-all duration-300 ease-in-out"
    >
      {showImages ? 'Add By List' : 'Add By Image'}
    </div>
  </div>
);

const TokenSelector = ({
  showImages,
  tokens,
  collectionMetadata,
  values,
  setValues,
}: {
  showImages: boolean;
  tokens: Array<{
    id: number;
  }>;
  collectionMetadata: string;
  values: Array<Option>;
  setValues: Dispatch<SetStateAction<Array<Option>>>;
}) => (
  <div className="text-foreground">
    {showImages ? (
      <ImageSelector
        tokens={tokens}
        metadataUrl={collectionMetadata}
        values={values}
        setValues={setValues}
      />
    ) : (
      <NftTokenSelector
        placeholder="Select Token Ids"
        options={tokens.map(
          t => ({ value: t.id.toString(), label: t.id }) as unknown as Option
        )}
        values={values}
        setValues={setValues}
      />
    )}
  </div>
);

const AddressInput = ({
  addressToSend,
  handleAddressInput,
  recentlyUsedAddresses,
  showRecentAddresses,
  setShowRecentAddresses,
  handleAddressChange,
  setAddressToSend,
}: {
  addressToSend: string;
  handleAddressInput: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  recentlyUsedAddresses: string[];
  showRecentAddresses: boolean;
  setShowRecentAddresses: Dispatch<SetStateAction<boolean>>;
  handleAddressChange: (address: string) => Promise<void>;
  setAddressToSend: Dispatch<SetStateAction<string>>;
}) => (
  <div className="text-foreground">
    <div className="pb-2 inner">
      <h2>Address To Send Tokens</h2>
    </div>
    <div className="relative">
      <Input
        type="text"
        className="text-[16px] md:text-sm"
        placeholder="Wallet Address"
        value={addressToSend}
        onChange={handleAddressInput}
        autoComplete="off"
      />
      {recentlyUsedAddresses.length > 0 && (
        <div
          className="absolute -top-[2px] right-0 -translate-x-2 translate-y-1/2 grid py-1 px-2 text-[9px] uppercase text-sendy tracking-wider cursor-pointer rounded-lg bg-muted hover:bg-sendy hover:text-background transition-all duration-300 ease-in-out"
          onClick={() => setShowRecentAddresses(!showRecentAddresses)}
        >
          RECENT ADDRESSES
        </div>
      )}
      {showRecentAddresses && (
        <RecentAddressesDropdown
          setAddressToSend={setAddressToSend}
          setShowRecentAddresses={setShowRecentAddresses}
          handleAddressChange={handleAddressChange}
          recentlyUsedAddresses={recentlyUsedAddresses}
        />
      )}
    </div>
  </div>
);

const RecentAddressesDropdown = ({
  setAddressToSend,
  setShowRecentAddresses,
  handleAddressChange,
  recentlyUsedAddresses,
}: {
  setAddressToSend: Dispatch<SetStateAction<string>>;
  setShowRecentAddresses: Dispatch<SetStateAction<boolean>>;
  handleAddressChange: (address: string) => Promise<void>;
  recentlyUsedAddresses: string[];
}) =>
  recentlyUsedAddresses.length > 0 && (
    <RecentAddresses
      setAddressToSend={setAddressToSend}
      setShowRecentAddresses={setShowRecentAddresses}
      handleAddressChange={handleAddressChange}
    />
  );

const ActionButtons = ({
  reset,
  setReset,
  handleAddTransaction,
}: {
  reset: boolean;
  setReset: Dispatch<SetStateAction<boolean>>;
  handleAddTransaction: () => void;
}) => (
  <div>
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
        onClick={handleAddTransaction}
      >
        Add Transfer
      </Button>
    </div>
  </div>
);
