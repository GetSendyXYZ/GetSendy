import { type SubmittableExtrinsic } from '@polkadot/api/types';
import { type ISubmittableResult } from '@polkadot/types/types';
import type { ApiPromise } from '@polkadot/api/promise';
import type { NetworkName } from '@therootnetwork/api';

export type Extrinsic = SubmittableExtrinsic<'promise', ISubmittableResult>;
export type ExtrinsicArray = Array<Extrinsic>;

export type IToken = {
  slug: string;
  name: string;
  tokenId: number;
  icon: string;
  decimals: number;
};

export type ITokenWithBalance = IToken & { balance: bigint };

export type ITokens = Array<IToken>;
export type ITokensWithBalances = ITokenWithBalance[];

export type IAcceptedTokens = Record<string, ITokens>;
export type IAcceptedTokensWithBalances = ITokensWithBalances;

export type ICollection = {
  collectionId: number;
  collectionName: string;
};

export type ICollections = ICollection[];
export type ICommonCollections = Record<string, ICollections>;

export type OptionType = Record<'value' | 'label', string>;

export type ITokenToCheck = {
  assetId: string;
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

export type ITokenToCheckWithMetadata = ITokenToCheck & {
  name: string;
  symbol: string;
  decimals: number;
  icon: string;
};

export type ITokensToCheck = Array<ITokenToCheck> | undefined;
export type ITokensToCheckWithMetadata =
  | Array<ITokenToCheckWithMetadata>
  | undefined;

export type Sendy = {
  addedId: number;
  address: string;
  extrinsic: Extrinsic;
  collectionId?: string;
  collectionName?: string;
  tokenIds?: Array<number>;
  assetId?: number;
  amountToSend?: number;
  isTip?: boolean;
};

export type SendyArray = Array<Sendy>;

export type SendyAsset = {
  addedId: number;
  assetId?: number;
  address: string;
  amountToSend: number;
  pallet: string;
  palletMethod: string;
  extrinsic: Extrinsic;
};

export type BatchedSendys = SendyArray;
// export type BatchedSendyAssets = SendyAsset[];

export type Download = {
  address: string | undefined;
  tokensToSend: string | undefined;
};

export type DownloadData = Download[];

export enum SendyTxStatus {
  Idle,
  Pending,
  Processing,
  Success,
  Failed,
}

export enum SendyProcess {
  StageZero,
  StageOne,
  StageTwo,
  StageThree,
  StageFour,
  StageFive,
  StageFinal,
}

export enum SendyTokenType {
  NativeToken,
  NativeNFT,
  NativeSFT,
}

// helpers for HOC props
export type OmitProps<T, K> = Pick<T, Exclude<keyof T, K>>;
export type SubtractProps<T, K> = OmitProps<T, keyof K>;

export interface BareProps {
  className?: string;
}

export interface NetworkProps {
  network: NetworkName;
  setNetwork: (network: NetworkName) => void;
  isChanging: boolean;
  setIsChanging: (isChanging: boolean) => void;
}

export interface ApiProps {
  rootApi: ApiPromise;
  // porciniApi: ApiPromise;
  apiError: string | null;
  isApiConnected: boolean;
  isApiInitialized: boolean;
  isApiReady: boolean;
  isApiConnecting: boolean;
}

export interface OnChangeCbObs {
  next: (value?: unknown) => unknown;
}

export type OnChangeCbFn = (value?: unknown) => unknown;
export type OnChangeCb = OnChangeCbObs | OnChangeCbFn;

export interface ChangeProps {
  callOnResult?: OnChangeCb;
}

export interface CallState {
  callResult?: unknown;
  callUpdated?: boolean;
  callUpdatedAt?: number;
}

export type CallProps = ApiProps & CallState;

export interface BaseProps<T> extends BareProps, CallProps, ChangeProps {
  children?: React.ReactNode;
  label?: string;
  render?: (value?: T) => React.ReactNode;
}

export type Formatter = (value?: unknown) => string;

export type Environment = 'web' | 'app';

export type OutputData<T extends SendyTokenType> =
  T extends SendyTokenType.NativeToken
    ? Record<string, number>
    : T extends SendyTokenType.NativeNFT | SendyTokenType.NativeSFT
      ? Record<string, number[]>
      : Record<string, number>;

export type NftMetadata = {
  properties: Record<string, string>;
  uri: string;
  attributes: Array<{ trait_type: string; value: string }>;
  image: string;
  animation_url: string;
  image_png: string;
};

export interface SendyProps {
  BATCH_SIZE: number;
  tipAdded: boolean;
  setTipAdded: (tipAdded: boolean) => void;
  tipTokenId: number;
  setTipTokenId: (tipTokenId: number) => void;
  tipTokenSymbol: string;
  setTipTokenSymbol: (tipTokenSymbol: string) => void;

  tipAmount: number;
  setTipAmount: (tipAmount: number) => void;
  currentSendyProcess: SendyProcess;
  setCurrentSendyProcess: (currentSendyProcess: SendyProcess) => void;
  tokenType: SendyTokenType;
  setTokenType: (tokenType: SendyTokenType) => void;
  selectedTokenId: number;
  setSelectedTokenId: (selectedTokenId: number) => void;
  selectedCollectionId: number;
  setSelectedCollectionId: (selectedCollectionId: number) => void;
  selectedCollectionName: string;
  setSelectedCollectionName: (selectedCollectionName: string) => void;
  selectedCollectionMetadata: string;
  setSelectedCollectionMetadata: (selectedCollectionMetadata: string) => void;
  selectedTokenSymbol: string;
  setSelectedTokenSymbol: (selectedTokenSymbol: string) => void;
  currentTxStatus: SendyTxStatus;
  setCurrentTxStatus: (currentAirdropTxStatus: SendyTxStatus) => void;
  inputData: string;
  setInputData: (inputData: string) => void;
  outputData: OutputData<SendyTokenType>;
  setOutputData: (outputData: OutputData<SendyTokenType>) => void;
  openAlert: boolean;
  setOpenAlert: (openAlert: boolean) => void;
  alertMessage: string;
  alertTitle: string;
  resetAlert: () => void;
  setAlert: (message: string, title: string) => void;
  batchedExtrinsics: Extrinsic[];
  setBatchedExtrinsics: (batchedExtrinsics: Extrinsic[]) => void;
  explainers: string[];
  setExplainers: (explainers: string[]) => void;
  batchedSendys: BatchedSendys;
  setBatchedSendys: (batchedSendys: BatchedSendys) => void;
  resetSendyProvider: () => Promise<void>;
  assetTotals: Record<number, bigint>;
  setAssetTotals: (assetTotals: Record<number, bigint>) => void;
  selectedPairs: { collectionId: string; tokenId: number }[];
  setSelectedPairs: (
    selectedPairs: { collectionId: string; tokenId: number }[]
  ) => void;
  downloadData: DownloadData;
  setDownloadData: (downloadData: DownloadData) => void;
  recentlyUsedAddresses: string[];
  addRecentlyUsedAddress: (recentlyUsedAddresses: string) => void;
  recentlyUsedCollection: string[];
  addRecentlyUsedCollection: (recentlyUsedCollection: string) => void;
  resetRecentlyUsedAddresses: () => void;
  resetRecentlyUsedCollections: () => void;
}
