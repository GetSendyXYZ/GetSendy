/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from '@/env';
import { acceptedGasTokens } from '@/utils';
import { type ClassValue, clsx } from 'clsx';
import type { EventRecord } from '@polkadot/types/interfaces/system';
import { type BN, formatBalance } from '@polkadot/util';

import { twMerge } from 'tailwind-merge';

export const TOKEN_DECIMALS = 6;
export const TOKEN_NAME = 'XRP';

export const unscaleBy = (value: string | number | BN, decimals: number) => {
  return formatBalance(value, {
    decimals,
    forceUnit: '-',
    withSi: false,
  }).split(',');
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortenAddress = (
  walletAddress: string,
  begin: number,
  end: number
) => {
  return (
    walletAddress.substring(0, begin) +
    '...' +
    walletAddress.substring(walletAddress.length - end, walletAddress.length)
  );
};

export const jsonToCsv = (json: any) => {
  const replacer = (key: any, value: any) => (value === null ? '' : value);
  const header = Object.keys(json[0]);
  const csv = json.map((row: any) =>
    header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',')
  );
  csv.unshift(header.join(','));
  return csv.join('\r\n');
};

export const downloadCsv = (data: any, filename: string) => {
  const csv = jsonToCsv(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const downloadJson = (data: any, filename: string) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `${filename}.json`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const getGasToken = (token: number) => {
  const gasToken = acceptedGasTokens[env.NEXT_PUBLIC_NETWORK]?.find(
    t => t.tokenId === token
  );
  if (!gasToken) {
    throw new Error(`Gas token ${token} not found in acceptedGasTokens`);
  }
  return gasToken?.tokenId;
};

export function filterExtrinsicEvents(
  events: EventRecord[],
  names: `${string}.${string}`[]
) {
  return events.filter(({ event }) => {
    const name = `${event?.section[0]?.toUpperCase() + event.section.slice(1)}.${
      event.method
    }`;

    return names.includes(name as `${string}.${string}`);
  });
}

export function getGas(
  estimatedFee: string,
  tokenDecimals = TOKEN_DECIMALS,
  gasToken = TOKEN_NAME
): string {
  const gas = unscaleBy(estimatedFee ?? '0', tokenDecimals).toString();
  return `${gas} ${gasToken}`;
}

export const addressToCollectionId = (address: string) => {
  const hexId = address.slice(10, 18); // Extract the hexadecimal part of the address
  const collectionId = parseInt(hexId, 16); // Convert the hexadecimal to a number
  return collectionId;
};

// export function clientToSigner(client: Client<Transport, Chain, Account>) {
//   const { account, chain, transport } = client;

//   console.log('account:', account, 'chain:', chain, 'transport:', transport);

//   const network = {
//     chainId: chain.id,
//     name: chain.name,
//     ensAddress: chain.contracts?.ensRegistry?.address,
//   };
//   const provider = new BrowserProvider(transport, network);

//   console.log('provider:', provider);

//   const signer = new JsonRpcSigner(provider, account.address);

//   console.log('signer:', signer);
//   return signer;
// }

// /** Action to convert a viem Wallet Client to an ethers.js Signer. */
// export async function getEthersSigner(
//   config: Config,
//   { chainId }: { chainId?: number } = {}
// ) {
//   console.log('config:', config);
//   console.log('chainId:', chainId);

//   const client = await getConnectorClient(config, { chainId });
//   console.log('client:', client);
//   return clientToSigner(client);
// }
