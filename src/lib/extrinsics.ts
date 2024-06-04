import { env } from '@/env';
import type {
  IAcceptedTokensWithBalances,
  IToken,
  ITokens,
  ITokensToCheck,
} from '@/types';
import { acceptedGasTokens } from '@/utils';
import type { ApiPromise } from '@polkadot/api';
import { hexToString } from '@polkadot/util';

export const getAllTokens = async ({ rootApi }: { rootApi: ApiPromise }) => {
  try {
    const assetKeys = await rootApi.query.assets.asset.entries();
    const assets = assetKeys.map(([key, details]) => {
      const assetId = key.args.map(k => k.toHuman())[0] ?? '';
      const assetInfo = details.toJSON() as unknown as {
        owner: string;
        issuer: string;
        admin: string;
        freezer: string;
        supply: bigint;
        deposit: bigint;
        minBalance: bigint;
        isSufficient: boolean;
        accounts: number;
        sufficients: number;
        approvals: number;
        isFrozen: boolean;
      };

      const {
        owner,
        issuer,
        admin,
        freezer,
        supply,
        deposit,
        minBalance,
        isSufficient,
        accounts,
        sufficients,
        approvals,
        isFrozen,
      } = assetInfo;

      const assetIdToUse = assetId?.toString().replaceAll(',', '');

      return {
        assetId: assetIdToUse,
        owner,
        issuer,
        admin,
        freezer,
        supply,
        deposit,
        minBalance,
        isSufficient,
        accounts,
        sufficients,
        approvals,
        isFrozen,
      };
    });

    return assets;
  } catch (error) {
    console.error('Error fetching balances', error);
  }
};

export const getCollectionTokens = async ({
  rootApi,
  collectionId,
  address,
}: {
  rootApi: ApiPromise;
  collectionId: number;
  address: string;
}) => {
  const data = await rootApi.rpc.nft.ownedTokens(
    collectionId,
    address,
    0,
    env.NEXT_PUBLIC_BATCH_SIZE ?? 100
  );

  return data.toJSON();
};

export const getCollectionInfo = async ({
  rootApi,
  collectionId,
}: {
  rootApi: ApiPromise;
  collectionId: number;
}) => {
  const data = await rootApi.query.nft.collectionInfo(collectionId);
  return data.toJSON();
};

export const getSftCollectionInfo = async ({
  rootApi,
  collectionId,
}: {
  rootApi: ApiPromise;
  collectionId: number;
}) => {
  const data = await rootApi.query.sft.sftCollectionInfo(collectionId);
  return data.toJSON();
};

export const getSftTokenInfo = async ({
  rootApi,
  collectionId,
  tokenId,
}: {
  rootApi: ApiPromise;
  collectionId: number;
  tokenId: number;
}) => {
  const data = await rootApi.query.sft.tokenInfo(collectionId, tokenId);
  return data.toJSON();
};

// export const getSftCollectionTokens = async ({
//   rootApi,
//   collectionId,
//   // address,
// }: {
//   rootApi: ApiPromise;
//   collectionId: number;
//   address: string;
// }) => {
//   const data = await rootApi.query.sft.sftCollectionInfo(collectionId);
//   const collectionInfo = data.unwrap();

//   // let ownedTokens: Array<number> = [];

//   for (let i = 0; i < collectionInfo.nextSerialNumber.toNumber(); i++) {
//     const tokenData = await rootApi.query.sft.tokenInfo(collectionId, i);
//     // console.log(tokenData.toJSON());

//     // const tData = tokenData.toJSON();
//   }

//   return data.toJSON();
// };

export const getBalances = async ({
  rootApi,
  network,
  address,
  tokensToCheck,
}: {
  rootApi: ApiPromise;
  network: 'root' | 'porcini';
  address: string;
  tokensToCheck?: ITokens;
}) => {
  try {
    const tokens = tokensToCheck ? tokensToCheck : acceptedGasTokens[network];

    const { data: rootData } = await rootApi.query.system.account(address);

    const maxFrozen = rootData.feeFrozen.gte(rootData.miscFrozen)
      ? rootData.feeFrozen
      : rootData.miscFrozen;

    const rootBal = rootData.free.sub(maxFrozen);
    const rootBalance = BigInt(rootBal.toString());

    const data = await rootApi.query.assets.account.multi(
      tokens
        ?.filter(token => token.tokenId !== 1)
        .map((token: IToken) => [token.tokenId, address]) ?? []
    );

    const tokenData = data.map(t => {
      const tokenBal = t?.toJSON()
        ? BigInt((t.toJSON() as { balance: number })?.balance.toString())
        : BigInt(0);

      return { balance: tokenBal };
    });

    const tokensToReturn: IAcceptedTokensWithBalances = (tokens ?? []).map(
      (token: IToken, index: number) => {
        if (index === 0) {
          return {
            ...token,
            balance: rootBalance ?? BigInt(0),
          };
        } else {
          return {
            ...token,
            balance: tokenData[index - 1]?.balance ?? BigInt(0),
          };
        }
      }
    );

    return tokensToReturn;
  } catch (error) {
    console.error('Error fetching balances', error);
  }
};

export const getTokenMetadata = async ({
  rootApi,
  tokensToCheck,
}: {
  rootApi: ApiPromise;
  tokensToCheck?: ITokensToCheck;
}) => {
  try {
    const tokensSorted = tokensToCheck
      ? tokensToCheck
          ?.filter(t => !t.owner.toLowerCase().startsWith('0xdddddddd'))
          ?.sort((a, b) => (BigInt(a.assetId) - BigInt(b.assetId) > 0 ? 1 : -1))
      : [];

    const assetMetadata = await rootApi.query.assets.metadata.multi(
      tokensSorted.map(t => t.assetId)
    );

    const metadataTokens = assetMetadata.map((metadata, index) => {
      const token = tokensSorted[index];
      const metadataToUse = metadata.toJSON() as unknown as {
        name: string;
        symbol: string;
        decimals: number;
        icon: string;
      };

      const { name, symbol, decimals } = metadataToUse;

      return {
        ...token,
        name: hexToString(name),
        symbol: hexToString(symbol),
        decimals,
        icon: '',
      };
    });

    return metadataTokens;
  } catch (error) {
    console.error('Error fetching balances', error);
  }
};
