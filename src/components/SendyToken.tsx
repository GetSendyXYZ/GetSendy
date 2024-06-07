/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useAccountProvider } from '@/Providers/AccountProvider';
import { useSendyProvider } from '@/Providers/SendyProvider';
import { useTrnApi } from '@/Providers/TrnApiProvider';

import { useState, useMemo, useCallback } from 'react';
import { utils } from 'ethers';

import TokenDropDown from './TokenDropDown';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useDebounce } from './ui/multiple-selector';
import { useQueryClient } from '@tanstack/react-query';
import { Checkbox } from './ui/checkbox';

import { RecentAddresses } from './RecentAddresses';
import type { BatchedSendys, Sendy } from '@/types';
import { useRnsResolveRns } from '@/hooks/useRns';

export default function SendyToken() {
  return (
    <div className="">
      <SendyTokenInput />
    </div>
  );
}

const SendyTokenInput = () => {
  const {
    batchedSendys,
    setBatchedSendys,
    selectedTokenId,
    setSelectedTokenId,
    assetTotals,
    setAssetTotals,
    addRecentlyUsedAddress,
    recentlyUsedAddresses,
  } = useSendyProvider();

  const queryClient = useQueryClient();
  const { rootApi } = useTrnApi();

  const [value, setValue] = useState<number>(0);
  const { tokensWithBalances } = useAccountProvider();

  const [addressToSend, setAddressToSend] = useState<string>('');
  const { data: resolvedAddy, isFetching: rnsFetching } =
    useRnsResolveRns(addressToSend);

  const debouchedAddressToSend = useDebounce(
    resolvedAddy ?? addressToSend,
    500
  );

  const [reset, setReset] = useState(false);

  const [showRecentAddresses, setShowRecentAddresses] = useState(false);

  const handleAddTransaction = () => {
    if (!selectedTokenId || !addressToSend || value <= 0 || !rootApi) {
      return;
    }

    const valueToUse = utils.parseUnits(
      value.toString(),
      tokensWithBalances?.find(t => t.tokenId === selectedTokenId ?? 0)
        ?.decimals
    );

    let extrinsic;

    if (selectedTokenId === 1) {
      extrinsic = rootApi.tx.balances.transferKeepAlive(
        debouchedAddressToSend,
        valueToUse.toBigInt()
      );
    } else {
      extrinsic = rootApi.tx.assets.transferKeepAlive(
        selectedTokenId,
        debouchedAddressToSend,
        valueToUse.toBigInt()
      );
    }

    const sendy: Sendy = {
      addedId: batchedSendys.length + 1,
      assetId: selectedTokenId,
      address: debouchedAddressToSend,
      amountToSend: value,
      extrinsic,
      isTip: false,
    };

    addRecentlyUsedAddress(debouchedAddressToSend);

    // console.log('handleAddTransaction', usingRns, addressToSend);

    if (resolvedAddy && addressToSend) {
      addRecentlyUsedAddress(addressToSend);
    }

    //@ts-expect-error - Typing issue
    setBatchedSendys((prev: BatchedSendys) => [...prev, sendy]);

    //@ts-expect-error - Typing issue
    setAssetTotals((prev: Record<number, bigint>) => ({
      ...prev,
      [selectedTokenId]: (prev[selectedTokenId] ?? 0n) + valueToUse.toBigInt(),
    }));

    if (reset) {
      setValue(0);
      setAddressToSend('');
      setSelectedTokenId(0);
    } else {
      setValue(0);
    }
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

  const handleAddressChange = useCallback(async (address: string) => {
    setAddressToSend(address);
    if (address === '') {
      setAddressToSend('');
    }
    return;
  }, []);

  const handleAddressInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setAddressToSend(address);
  };

  const getValMax = useMemo(() => {
    return parseFloat(
      utils.formatUnits(
        (tokensWithBalances?.find(t => t.tokenId === selectedTokenId)
          ?.balance ?? BigInt(0)) - (assetTotals[selectedTokenId] ?? BigInt(0)),
        tokensWithBalances?.find(t => t.tokenId === selectedTokenId)?.decimals
      )
    );
  }, [selectedTokenId, tokensWithBalances, assetTotals]);

  return (
    <div className="grid grid-cols-1 gap-3 w-full backdrop-blur-[6px] justify-between items-center p-3 bg-mutedOpacity bg-opacity-60 rounded-lg z-20 relative ">
      <div className="text-foreground">
        <h2>Select tokens in your wallet</h2>
        <div className=" pt-2 inner relative">
          <div
            className="absolute top-7 right-8 -translate-x-2 -translate-y-1/2 grid py-1 px-2 text-[9px] uppercase text-sendy tracking-wider cursor-pointer rounded-lg bg-muted hover:bg-sendy hover:text-background transition-all duration-300 ease-in-out"
            onClick={async () => {
              await queryClient.invalidateQueries();
            }}
          >
            REFRESH TOKEN LIST
          </div>
          <TokenDropDown />
        </div>
      </div>
      {selectedTokenId ? (
        <div className="text-foreground">
          <div className=" inner">
            <h2>Amount To Send</h2>
          </div>
          <div className="pt-2 inner relative">
            <div
              className="absolute top-7 right-0 -translate-x-2 -translate-y-1/2 grid py-1 px-2 text-[9px] uppercase text-sendy tracking-wider cursor-pointer rounded-lg bg-muted hover:bg-sendy hover:text-background transition-all duration-300 ease-in-out"
              onClick={() =>
                selectedTokenId && tokensWithBalances
                  ? setValue(
                      parseFloat(
                        utils.formatUnits(
                          (tokensWithBalances?.find(
                            t => t.tokenId === selectedTokenId
                          )?.balance ?? BigInt(0)) -
                            (assetTotals[selectedTokenId] ?? BigInt(0)),
                          tokensWithBalances?.find(
                            t => t.tokenId === selectedTokenId
                          )?.decimals
                        )
                      )
                    )
                  : null
              }
            >
              MAX
            </div>
            <Input
              type="number"
              className="text-[16px] md:text-sm text-foreground"
              placeholder="Token Amount"
              value={value.toString()}
              onChange={e =>
                parseFloat(e.target.value) < getValMax
                  ? setValue(parseFloat(e.target.value))
                  : null
              }
              autoComplete="off"
              max={getValMax}
            />
          </div>
        </div>
      ) : null}
      {value && value > 0 ? (
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
      ) : null}
      {rnsFetching && (
        <div className="text-xs text-foreground">Checking Address</div>
      )}
      {value && value > 0 && resolvedAddy && !rnsFetching ? (
        <div className="text-xs text-foreground">
          Resolved Address: {resolvedAddy}
        </div>
      ) : null}
      {debouchedAddressToSend && isValidAddress && (
        <div className="text-foreground">
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
