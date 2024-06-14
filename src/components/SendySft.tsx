import { type Dispatch, type SetStateAction, useState } from 'react';
import { type Option } from './ui/multiple-selector';
import { useSendyProvider } from '@/Providers/SendyProvider';
import { useTrnApi } from '@/Providers/TrnApiProvider';
import { commonCollections } from '@/utils';
import { env } from '@/env';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import CollectionsWithRecentAndCommon from './CollectionsWithRecentAndCommon';
import type { Sendy } from '@/types';
import { RecentAddresses } from './RecentAddresses';
import useCollectionData from '@/hooks/useCollectionData';
import useAddress from '@/hooks/useAddress';
import { type u128, type u32, type Vec } from '@polkadot/types';
import { type ITuple } from '@polkadot/types/types';
import SftImageSelector from './SftImageSelector';
import SftTokenSelector from './SftTokenSelector';

export default function SendyNft() {
  return (
    <div className="">
      <SendySftInput />
    </div>
  );
}

const SendySftInput = () => {
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
  const [quantities, setQuantities] = useState<Array<Option>>([]);
  const [reset, setReset] = useState(false);
  const [showRecentAddresses, setShowRecentAddresses] = useState(false);

  const handleAddTransaction = () => {
    if (!collectionIdToUse || !addressToSend || !values || !quantities) return;

    const vs = values?.map(v => parseInt(v.value));
    const qty = quantities?.map(q => parseInt(q.value));

    if (!vs || !qty || vs.length !== qty.length) return;

    const valueQty = vs.map((v, i) => [v, qty[i]]) as unknown as Vec<
      ITuple<[u32, u128]>
    >;

    const extrinsic = rootApi.tx.sft.transfer(
      collectionIdToUse,
      valueQty,
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
          <SendySftHeader
            collectionName={collectionName}
            showImages={showImages}
            setShowImages={setShowImages}
          />

          {values &&
            values?.length > 0 &&
            values.map((value, i) => (
              <SftTokenSelectorOuter
                key={`sft-selector-${i}`}
                showImages={showImages}
                tokens={tokens}
                collectionMetadata={collectionMetadata}
                values={values}
                setValues={setValues}
                selectedValue={value}
                quantities={quantities}
                setQuantities={setQuantities}
              />
            ))}

          <SftTokenSelectorOuter
            showImages={showImages}
            tokens={tokens}
            collectionMetadata={collectionMetadata}
          />
        </div>
      )}

      {values && values?.length > 0 && (
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

      {values && values.length > 0 && resolvedAddy && !rnsFetching && (
        <div className="text-xs text-foreground">
          Resolved Address: {resolvedAddy}
        </div>
      )}

      {debouncedAddressToSend &&
        isValidAddress &&
        values &&
        values.length > 0 && (
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

const SendySftHeader = ({
  collectionName,
  showImages,
  setShowImages,
}: {
  collectionName: string;
  showImages: boolean;
  setShowImages: Dispatch<SetStateAction<boolean>>;
}) => (
  <div className="pb-2 inner flex flex-row justify-between">
    <h2>Select token id to send from {collectionName}</h2>
    <div
      onClick={() => setShowImages(!showImages)}
      className="leading-0 flex py-1 px-2 text-[9px] uppercase text-sendy tracking-wider cursor-pointer rounded-lg bg-muted hover:bg-sendy hover:text-background transition-all duration-300 ease-in-out"
    >
      {showImages ? 'Add By List' : 'Add By Image'}
    </div>
  </div>
);

const SftTokenSelectorOuter = ({
  showImages,
  tokens,
  collectionMetadata,
  selectedValue,
  values,
  setValues,
  quantities,
  setQuantities,
}: {
  showImages: boolean;
  tokens: Array<{
    id: number;
  }>;
  collectionMetadata: string;
  selectedValue?: Option;
  values?: Array<Option>;
  setValues?: Dispatch<SetStateAction<Array<Option>>>;
  quantities?: Array<number>;
  setQuantities?: Dispatch<SetStateAction<Array<number>>>;
}) => {
  const [value, setValue] = useState<Option | null>(selectedValue ?? null);
  const [quantity, setQuantity] = useState<Option | null>(null);

  return (
    <div className="text-foreground">
      {showImages ? (
        <SftImageSelector
          tokens={tokens}
          metadataUrl={collectionMetadata}
          value={value}
          setValue={setValue}
          quantity={quantity}
          setQuantity={setQuantity}
          values={values}
          setValues={setValues}
          quantities={quantities}
          setQuantities={setQuantities}
        />
      ) : (
        <SftTokenSelector
          tokens={tokens}
          value={value}
          setValue={setValue}
          quantity={quantity}
          setQuantity={setQuantity}
          values={values}
          setValues={setValues}
          quantities={quantities}
          setQuantities={setQuantities}
        />
      )}
    </div>
  );
};

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
