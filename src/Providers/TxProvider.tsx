import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { type ISubmittableResult } from '@polkadot/types/types';
import type { ExtrinsicPayload } from '@futureverse/mint-sdk';
import { toast } from 'sonner';

export enum TxStatus {
  Idle,
  Pending,
  Processing,
  Success,
  Failed,
}

export interface TxProps {
  extrinsicId: string | null | undefined;
  setExtrinsicId: (extrinsicId: string | null | undefined) => void;
  extrinsicResult: unknown;
  setExtrinsicResult: (extrinsicResult: unknown) => void;
  txHash: string | null | undefined;
  setTxHash: (txHash: string | null | undefined) => void;
  txError: string | null | undefined;
  setTxError: (txError: string | null | undefined) => void;
  txStatus: TxStatus;
  setTxStatus: (txStatus: TxStatus) => void;

  encodedMessage: string | null | undefined;
  setEncodedMessage: (encodedMessage: string | null | undefined) => void;
  gasFee: string;
  setGasFee: (gasFee: string) => void;
  isInsufficientBalance: boolean | undefined;
  setIsInsufficientBalance: (
    isInsufficientBalance: boolean | undefined
  ) => void;
  txPayload: ExtrinsicPayload | null;
  setTxPayload: (txPayload: ExtrinsicPayload | null) => void;
  onContinue: () => void;
  setOnContinue: (onContinue: () => void) => void;
  onSigned: () => void;
  setOnSigned: (onSigned: () => void) => void;
  isPending: boolean | undefined;
  setIsPending: (isPending: boolean | undefined) => void;
  isDataLoading: boolean | undefined;
  setIsDataLoading: (isDataLoading: boolean | undefined) => void;
  txResult: ISubmittableResult | undefined;
  setTxResult: (txResult: ISubmittableResult | undefined) => void;
  onClose: () => void;
  setOnClose: (onClose: () => void) => void;
  showSignatureModal: boolean | undefined;
  setShowSignatureModal: (showSignatureModal: boolean | undefined) => void;
  showTxModal: boolean | undefined;
  setShowTxModal: (showTxModal: boolean | undefined) => void;
  showGasModal: boolean | undefined;
  setShowGasModal: (showGasModal: boolean | undefined) => void;
}

const TxContext: React.Context<TxProps> = createContext(
  {} as unknown as TxProps
);

export function useTxProvider(): TxProps {
  const context = useContext(TxContext);
  if (context === undefined) {
    throw new Error('useTxProvider must be used within a SendyProvider');
  }
  return context;
}

export const TXProvider: React.FC<{
  children: ReactNode;
}> = props => {
  const [extrinsicResult, setExtrinsicResult] = useState<unknown>();
  const [extrinsicId, setExtrinsicId] = useState<string | null | undefined>();
  const [txHash, setTxHash] = useState<string | null | undefined>();
  const [txError, setTxError] = useState<string | null | undefined>();

  const [encodedMessage, setEncodedMessage] = useState<
    string | null | undefined
  >();
  const [gasFee, setGasFee] = useState<string>('');
  const [isInsufficientBalance, setIsInsufficientBalance] = useState<
    boolean | undefined
  >();
  const [txPayload, setTxPayload] = useState<ExtrinsicPayload | null>(null);
  const [onContinue, setOnContinue] = useState<() => void>(() => null);
  const [onSigned, setOnSigned] = useState<() => void>(() => null);
  const [isPending, setIsPending] = useState<boolean | undefined>();
  const [isDataLoading, setIsDataLoading] = useState<boolean | undefined>();
  const [txResult, setTxResult] = useState<ISubmittableResult | undefined>();
  const [onClose, setOnClose] = useState<() => void>(() => null);
  const [showSignatureModal, setShowSignatureModal] = useState<
    boolean | undefined
  >();
  const [showTxModal, setShowTxModal] = useState<boolean | undefined>();
  const [showGasModal, setShowGasModal] = useState<boolean | undefined>();

  const [txStatus, setTxStatus] = useState<TxStatus>(TxStatus.Idle);

  const [toastId, setToastId] = useState<string | number>();

  useEffect(() => {
    if (txStatus === TxStatus.Processing) {
      const tId = toast.loading('Transaction processing');
      setToastId(tId);
    }
    if (txStatus === TxStatus.Success) {
      toast.dismiss(toastId);
      toast.success('Transaction successful');
    }
    if (txStatus === TxStatus.Failed) {
      toast.dismiss(toastId);
      toast.error('Transaction failed');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txStatus]);

  return (
    <TxContext.Provider
      value={{
        extrinsicId,
        setExtrinsicId,
        extrinsicResult,
        setExtrinsicResult,
        txHash,
        setTxHash,
        txError,
        setTxError,
        encodedMessage,
        setEncodedMessage,
        gasFee,
        setGasFee,
        isInsufficientBalance,
        setIsInsufficientBalance,
        txPayload,
        setTxPayload,
        onContinue,
        setOnContinue,
        isPending,
        setIsPending,
        isDataLoading,
        setIsDataLoading,
        txResult,
        setTxResult,
        onClose,
        setOnClose,
        showSignatureModal,
        setShowSignatureModal,
        txStatus,
        setTxStatus,
        showTxModal,
        setShowTxModal,
        onSigned,
        setOnSigned,
        showGasModal,
        setShowGasModal,
      }}
    >
      {props.children}
    </TxContext.Provider>
  );
};
