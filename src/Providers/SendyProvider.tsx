import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import { AppAlert } from '@/components/AppAlert';
import { env } from '@/env';

import { useQueryClient } from '@tanstack/react-query';
import useLocalStorage from '@/hooks/useLocalStorage';
import type {
  BatchedSendys,
  DownloadData,
  ExtrinsicArray,
  OutputData,
  SendyProps,
} from '@/types';
import { SendyTxStatus, SendyProcess, SendyTokenType } from '@/types';
import { downloadCsv, downloadJson } from '@/utils';

const SendyContext: React.Context<SendyProps> = createContext(
  {} as unknown as SendyProps
);

export function useSendyProvider(): SendyProps {
  const context = useContext(SendyContext);

  if (context === undefined) {
    throw new Error('useSendyProvider must be used within a SendyProvider');
  }
  return context;
}

export const SendyProvider: React.FC<{
  children: ReactNode;
}> = props => {
  const queryClient = useQueryClient();

  const [currentSendyProcess, setCurrentSendyProcess] = useState<SendyProcess>(
    SendyProcess.StageOne
  );

  const BATCH_SIZE = env.NEXT_PUBLIC_BATCH_SIZE;

  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');

  const [tokenType, setTokenType] = useState<SendyTokenType>(
    SendyTokenType.NativeToken
  );

  const [tipAdded, setTipAdded] = useState(false);
  const [tipTokenId, setTipTokenId] = useState(1);
  const [tipAmount, setTipAmount] = useState(50);
  const [tipTokenSymbol, setTipTokenSymbol] = useState('root');

  const [selectedTokenId, setSelectedTokenId] = useState<number>(0);
  const [selectedCollectionId, setSelectedCollectionId] = useState<number>(0);
  const [selectedCollectionName, setSelectedCollectionName] =
    useState<string>('');
  const [selectedCollectionMetadata, setSelectedCollectionMetadata] =
    useState<string>('');
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState<string>('');

  const [currentTxStatus, setCurrentTxStatus] = useState<SendyTxStatus>(
    SendyTxStatus.Idle
  );

  const [downloadData, setDownloadData] = useState<DownloadData>([]);

  const [inputData, setInputData] = useState<string>('');
  const [outputData, setOutputData] = useState<OutputData<SendyTokenType>>({});
  const [batchedExtrinsics, setBatchedExtrinsics] = useState<ExtrinsicArray>(
    []
  );

  const [explainers, setExplainers] = useState<string[]>([]);
  const [batchedSendys, setBatchedSendys] = useState<BatchedSendys>([]);

  const [selectedPairs, setSelectedPairs] = useState<
    { collectionId: string; tokenId: number }[]
  >([]);
  const [assetTotals, setAssetTotals] = useState<Record<number, bigint>>({});

  const recentlyUsedAddressKey = 'recentlyUsedAddresses';
  const recentlyUsedCollectionKey = 'recentlyUsedCollections';

  const [storedAddresses, addRecentAddress] = useLocalStorage<string[]>(
    recentlyUsedAddressKey,
    []
  );

  const [storedCollection, addRecentCollection] = useLocalStorage<string[]>(
    recentlyUsedCollectionKey,
    []
  );

  const addRecentlyUsedAddress = useCallback(
    (inputData: string) => {
      // console.log('inputData', inputData);
      const currentAddresses = storedAddresses;
      if (!currentAddresses.includes(inputData)) {
        currentAddresses.push(inputData);
      }
      addRecentAddress(currentAddresses);
    },
    [addRecentAddress, storedAddresses]
  );

  const addRecentlyUsedCollection = useCallback(
    (inputData: string) => {
      // console.log('inputData', inputData);
      const currentCollections = storedCollection;
      if (!currentCollections.includes(inputData)) {
        currentCollections.push(inputData);
      }
      addRecentCollection(currentCollections);
    },
    [addRecentCollection, storedCollection]
  );

  const resetRecentlyUsedAddresses = useCallback(() => {
    localStorage.removeItem(recentlyUsedAddressKey);
  }, []);

  const resetRecentlyUsedCollections = useCallback(() => {
    localStorage.removeItem(recentlyUsedCollectionKey);
  }, []);

  const resetAlert = useCallback(() => {
    setAlertMessage('');
    setAlertTitle('');
    setOpenAlert(false);
  }, [setAlertMessage, setAlertTitle, setOpenAlert]);

  const setAlert = useCallback(
    (message: string, title: string) => {
      setAlertMessage(message);
      setAlertTitle(title);
      setOpenAlert(true);
    },
    [setAlertMessage, setAlertTitle, setOpenAlert]
  );

  const handleDownloadCSV = useCallback(
    (filename: string, nextStep: SendyProcess) => {
      downloadCsv(downloadData, filename);
      setCurrentSendyProcess(nextStep);
    },
    [downloadData, setCurrentSendyProcess]
  );

  const handleDownloadJSON = useCallback(
    (filename: string, nextStep: SendyProcess) => {
      downloadJson(downloadData, filename);
      setCurrentSendyProcess(nextStep);
    },
    [downloadData, setCurrentSendyProcess]
  );

  const resetSendyProvider = useCallback(async () => {
    setCurrentSendyProcess(SendyProcess.StageOne);
    setTokenType(SendyTokenType.NativeToken);
    setSelectedTokenId(0);
    setSelectedTokenSymbol('');
    setSelectedCollectionId(0);
    setSelectedCollectionName('');
    setSelectedCollectionMetadata('');
    setCurrentTxStatus(SendyTxStatus.Idle);
    setInputData('');
    setOutputData({});
    setBatchedExtrinsics([]);
    setExplainers([]);
    setBatchedSendys([]);
    resetAlert();
    setTipAdded(false);
    setTipAmount(50);
    setTipTokenId(1);
    setTipTokenSymbol('root');
    setAssetTotals({});
    setSelectedPairs([]);
    setDownloadData([]);
    await queryClient.invalidateQueries();
  }, [
    setCurrentSendyProcess,
    setTokenType,
    setSelectedTokenId,
    setSelectedCollectionId,
    setSelectedCollectionName,
    setSelectedCollectionMetadata,
    setSelectedTokenSymbol,
    setCurrentTxStatus,
    setInputData,
    setOutputData,
    setBatchedExtrinsics,
    setExplainers,
    setBatchedSendys,
    resetAlert,
    queryClient,
  ]);

  return (
    <SendyContext.Provider
      value={{
        BATCH_SIZE,
        tipAdded,
        setTipAdded,
        tipTokenId,
        setTipTokenId,
        tipAmount,
        setTipAmount,
        tipTokenSymbol,
        setTipTokenSymbol,
        currentSendyProcess,
        setCurrentSendyProcess,
        currentTxStatus,
        setCurrentTxStatus,
        tokenType,
        setTokenType,
        selectedTokenId,
        setSelectedTokenId,
        selectedCollectionId,
        setSelectedCollectionId,
        selectedTokenSymbol,
        setSelectedTokenSymbol,
        inputData,
        setInputData,
        outputData,
        setOutputData,
        openAlert,
        setOpenAlert,
        alertMessage,
        alertTitle,
        resetAlert,
        setAlert,
        batchedExtrinsics,
        setBatchedExtrinsics,
        explainers,
        setExplainers,
        batchedSendys,
        setBatchedSendys,
        resetSendyProvider,
        selectedCollectionName,
        setSelectedCollectionName,
        selectedCollectionMetadata,
        setSelectedCollectionMetadata,
        assetTotals,
        setAssetTotals,
        selectedPairs,
        setSelectedPairs,
        downloadData,
        setDownloadData,
        recentlyUsedAddresses: storedAddresses,
        recentlyUsedCollection: storedCollection,
        addRecentlyUsedAddress,
        addRecentlyUsedCollection,
        resetRecentlyUsedAddresses,
        resetRecentlyUsedCollections,
        handleDownloadCSV,
        handleDownloadJSON,
      }}
    >
      <>
        {props.children}
        <AppAlert />
      </>
    </SendyContext.Provider>
  );
};
