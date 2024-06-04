import { Button } from './ui/button';

import { useAccount } from 'wagmi';
import { Copy, ExternalLink } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { utils, BigNumber, type BigNumberish } from 'ethers';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { useAccountProvider } from '@/Providers/AccountProvider';
import { useWalletProvider } from '@/Providers/WalletProvider';
import { useNetworkSelector } from '@/Providers/NetworkSelectorProvider';
import useCopy from '@/hooks/useCopy';
import React, { useMemo } from 'react';
import Image from 'next/image';
import { useSendyProvider } from '@/Providers/SendyProvider';
import type { ITokenWithBalance } from '@/types';
import { shortenAddress } from '@/utils';

export const WalletDrawer = () => {
  const { network } = useNetworkSelector();
  const { address } = useAccount();
  const { futurePass, activeAccount } = useAccountProvider();
  const { handleSignOut } = useWalletProvider();
  const { rnsAddyEoa, rnsAddyFuturePass } = useAccountProvider();

  const addressToUse = useMemo(() => {
    return activeAccount === 'eoa' ? address : futurePass ?? '';
  }, [address, futurePass, activeAccount]);

  const shortAddress = useMemo(
    () =>
      activeAccount === 'eoa'
        ? rnsAddyEoa ?? shortenAddress(addressToUse!, 6, 4)
        : rnsAddyFuturePass ?? shortenAddress(addressToUse!, 6, 4),
    [activeAccount, addressToUse, rnsAddyEoa, rnsAddyFuturePass]
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="dark:bg-sendyOpacity hover:bg-opacity-40 dark:hover:bg-opacity-40 transition-all duration-300 uppercase text-xs tracking-wider">
          {shortAddress}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col space-y-1 border-l-0">
        <>
          <SheetHeader>
            <SheetTitle>Wallet</SheetTitle>
          </SheetHeader>

          {address && (
            <div className="grid gap-4 ">
              <WalletCard address={address.toString()} type="eoa" />
            </div>
          )}

          {futurePass && !futurePass.startsWith('0x00000000') && (
            <div className="grid gap-4 ">
              <WalletCard address={futurePass.toString()} type="futurePass" />
            </div>
          )}

          <div className="network-wrapper">
            <a
              href={
                network === 'root'
                  ? 'https://porcini.getsendy.xyz'
                  : 'https://www.getsendy.xyz'
              }
              target="_blank"
              className=" flex items-center justify-between space-x-4 rounded-md border p-4"
            >
              <div>
                Switch to {network === 'root' ? 'Porcini' : 'The Root Network'}
              </div>
              <ExternalLink />
            </a>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button
                className="dark:bg-sendyOpacity hover:bg-opacity-40 dark:hover:bg-opacity-40 transition-all duration-300 w-full"
                onClick={() => handleSignOut()}
              >
                Log Out
              </Button>
            </SheetClose>
          </SheetFooter>
        </>
      </SheetContent>
    </Sheet>
  );
};

export const WalletCard = ({
  address,
  type,
}: {
  address: string;
  type: 'eoa' | 'futurePass';
}) => {
  const { resetSendyProvider } = useSendyProvider();

  const {
    balances,
    futurePassBalances,
    activeAccount,
    setActiveAccount,
    setActiveAccountAddress,
    activeAccountAddress,
    setChosenGasToken,
    chosenGasToken,
    rnsAddyEoa,
    rnsAddyFuturePass,
  } = useAccountProvider();
  const { copyText } = useCopy();

  const balancesToUse = type === 'eoa' ? balances : futurePassBalances;

  const shortAddress = useMemo(
    () =>
      type === 'eoa'
        ? rnsAddyEoa ?? shortenAddress(address)
        : rnsAddyFuturePass ?? shortenAddress(address),
    [address, rnsAddyEoa, rnsAddyFuturePass, type]
  );

  const fullAddress = useMemo(
    () =>
      type === 'eoa' ? rnsAddyEoa ?? address : rnsAddyFuturePass ?? address,
    [address, rnsAddyEoa, rnsAddyFuturePass, type]
  );

  // console.log('WD', balances, futurePassBalances);
  // console.log('balancesToUse WD', balancesToUse);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={`relative w-full p-3 cursor-pointer border-[1px] ${type === activeAccount ? 'active border-sendy hover:border-opacity-60' : 'hover:border-white'}  transition-all duration-300 ease-in-out`}
            onClick={async () => {
              setActiveAccount(type);
              setActiveAccountAddress(fullAddress);
              await resetSendyProvider();
            }}
          >
            {type === activeAccount && (
              <div className="absolute w-2 h-2 top-2 right-2 rounded-full bg-sendy cursor-pointer"></div>
            )}
            <CardHeader className="p-0">
              <div className="flex flex-row justify-start items-center leading-none">
                {shortAddress}
                <Copy
                  size={16}
                  className="ml-2 cursor-pointer"
                  onClick={(e: { stopPropagation: () => void }) => {
                    e.stopPropagation();
                    copyText(fullAddress);
                  }}
                />
              </div>
              {((type === 'eoa' && rnsAddyEoa) ??
                (type === 'futurePass' && rnsAddyFuturePass)) && (
                <div className="flex flex-row justify-start items-center leading-none opacity-40 text-sm">
                  {shortenAddress(address)}
                  <Copy
                    size={16}
                    className="ml-2 cursor-pointer"
                    onClick={(e: { stopPropagation: () => void }) => {
                      e.stopPropagation();
                      copyText(fullAddress);
                    }}
                  />
                </div>
              )}
              <div className="text-xs leading-none text-gray-400">
                {type.toUpperCase()}
              </div>
            </CardHeader>
            {balancesToUse && (
              <CardContent className="text-sm text-gray-400 p-0">
                <div className="flex flex-row flex-wrap gap-2 balance-wrap mt-3 justify-start items-center">
                  {balancesToUse
                    .filter((token: ITokenWithBalance) => token.balance > 0)
                    .map((token: ITokenWithBalance) => {
                      return (
                        <React.Fragment key={token.tokenId}>
                          <div
                            className={`inline-flex flex-row justify-items-center items-center px-2 py-1 rounded-md bg-gray-300 text-primary dark:bg-gray-600 border-[1px] ${chosenGasToken === token.tokenId && activeAccountAddress === address ? 'border-sendy' : 'border-transparent'} `}
                            onClick={() => setChosenGasToken(token.tokenId)}
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
                                utils.formatUnits(
                                  BigNumber.from(
                                    token.balance.toString()
                                  ) as BigNumberish,
                                  BigNumber.from(
                                    token.decimals.toString()
                                  ) as BigNumberish
                                )
                              ).toLocaleString()}{' '}
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                </div>
              </CardContent>
            )}
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <span className="uppercase text-[10px] ">
            {type === activeAccount
              ? `${type} active`
              : `Click to make ${type} active account`}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
