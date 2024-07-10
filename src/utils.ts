/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { env } from './env';
import type { IAcceptedTokens, ICommonCollections } from './types';

export const TIP_TOKEN_ADDRESS = env.NEXT_PUBLIC_TIP_TOKEN_ADDRESS;

export const shortenAddress = (walletAddress: string, begin = 6, end = 4) => {
  return (
    walletAddress.substring(0, begin) +
    '...' +
    walletAddress.substring(walletAddress.length - end, walletAddress.length)
  );
};

export const jsonToCsv = (json: Record<string, unknown>[] | undefined) => {
  if (!json || json.length === 0) {
    return '';
  }

  const replacer = (key: unknown, value: unknown) =>
    value === null ? '' : value;
  const header = json.length > 0 ? Object.keys(json[0]!) : [];
  const csv = json.map((row: Record<string, unknown>) =>
    header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',')
  );
  csv.unshift(header.join(','));
  return csv.join('\r\n');
};

export const downloadCsv = (data: unknown, filename: string) => {
  const csv = jsonToCsv(data as Record<string, unknown>[]);
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

export const downloadJson = (data: unknown, filename: string) => {
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

export const acceptedGasTokens: IAcceptedTokens = {
  root: [
    {
      slug: 'root',
      name: 'ROOT',
      tokenId: 1,
      icon: '/images/root-icon.svg',
      decimals: 6,
    },
    {
      slug: 'xrp',
      name: 'XRP',
      tokenId: 2,
      icon: '/images/xrp-icon.svg',
      decimals: 6,
    },
    {
      slug: 'vortex',
      name: 'Vortex',
      tokenId: 3,
      icon: '/images/vortex-icon.svg',
      decimals: 6,
    },
    {
      slug: 'asto',
      name: 'Asto',
      tokenId: 4196,
      icon: '/images/asto-icon.svg',
      decimals: 18,
    },
    {
      slug: 'sylo',
      name: 'Sylo',
      tokenId: 2148,
      icon: '/images/sylo-icon.svg',
      decimals: 18,
    },
  ],
  porcini: [
    {
      slug: 'root',
      name: 'ROOT',
      tokenId: 1,
      icon: '/images/root-icon.svg',
      decimals: 6,
    },
    {
      slug: 'xrp',
      name: 'XRP',
      tokenId: 2,
      icon: '/images/xrp-icon.svg',
      decimals: 6,
    },
    {
      slug: 'vortex',
      name: 'Vortex',
      tokenId: 3,
      icon: '/images/vortex-icon.svg',
      decimals: 6,
    },
    {
      slug: 'asto',
      name: 'Asto',
      tokenId: 17508,
      icon: '/images/asto-icon.svg',
      decimals: 18,
    },
    {
      slug: 'sylo',
      name: 'Sylo',
      tokenId: 3172,
      icon: '/images/sylo-icon.svg',
      decimals: 18,
    },
  ],
};

export const commonCollections: ICommonCollections = {
  root: [
    {
      collectionId: 1124,
      collectionName: 'TNL Bridged Collection',
    },
    {
      collectionId: 2148,
      collectionName: 'Amulets',
    },
    {
      collectionId: 3172,
      collectionName: 'Goblin',
    },
    {
      collectionId: 8292,
      collectionName: 'Tempus - Book 1 - 1st Edition',
    },
    {
      collectionId: 9316,
      collectionName: 'Tempus - Book 1 - 2nd Edition',
    },
    {
      collectionId: 10340,
      collectionName: 'RichieRich Collection',
    },
    {
      collectionId: 12388,
      collectionName: 'FLUF Bridged Collection',
    },
    {
      collectionId: 16484,
      collectionName: 'ATEM Car Club: Vehicles',
    },
    {
      collectionId: 17508,
      collectionName: 'Party Bear Unleashed',
    },
    {
      collectionId: 26724,
      collectionName: 'Muhammad Ali | The Next Legends - Gear',
    },
    {
      collectionId: 27748,
      collectionName: 'Party Bear Bridged Collection',
    },
    {
      collectionId: 33892,
      collectionName: 'Seekers Bridged Collection',
    },
    {
      collectionId: 34916,
      collectionName: 'Raicers Vehicle Types',
    },
    {
      collectionId: 35940,
      collectionName: 'Raicers Engines',
    },
    {
      collectionId: 36964,
      collectionName: 'Raicers Wheels',
    },
    {
      collectionId: 37988,
      collectionName: 'Raicers Exhausts',
    },
    {
      collectionId: 39012,
      collectionName: 'Raicers Front Wings',
    },
    {
      collectionId: 40036,
      collectionName: 'Raicers Rear Wings',
    },
    {
      collectionId: 37988,
      collectionName: 'Prysms',
    },
    {
      collectionId: 47204,
      collectionName: 'The Third Kingdom: SurrealScapes',
    },
  ],
  porcini: [
    {
      collectionId: 614500,
      collectionName: 'RichieRich Collection',
    },
    {
      collectionId: 1124,
      collectionName: 'TNL Bridged Collection',
    },
    {
      collectionId: 129124,
      collectionName: 'RichieTest',
    },
    {
      collectionId: 121956,
      collectionName: 'QTTest',
    },
    {
      collectionId: 348260,
      collectionName: 'NFT_1',
    },
    {
      collectionId: 349284,
      collectionName: 'NFT_2',
    },
    {
      collectionId: 350308,
      collectionName: 'NFT_3',
    },
    {
      collectionId: 351332,
      collectionName: 'NFT_4',
    },
    {
      collectionId: 352356,
      collectionName: 'NFT_5',
    },
    {
      collectionId: 353380,
      collectionName: 'NFT_6',
    },
    {
      collectionId: 669796,
      collectionName: 'Sendy Tester',
    },
    {
      collectionId: 671844,
      collectionName: 'Zerpmoncini',
    },
    {
      collectionId: 659556,
      collectionName: 'Porcini Seekers',
    },
    {
      collectionId: 665700,
      collectionName: 'Porcini Punks',
    },
  ],
};
