/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useCallback, useState } from 'react';

import useDebounce from '@/hooks/useDebounce';

import { AutosizeTextarea } from '../AutoSizeTextArea';
import { useDropzone } from 'react-dropzone';
import { useSendyProvider } from '@/Providers/SendyProvider';
import { useTrnApi } from '@/Providers/TrnApiProvider';
import { SendyProcess } from '@/types';

import { useAccountProvider } from '@/Providers/AccountProvider';
import { utils } from 'ethers';

export function DropNativeNfts() {
  const {
    setInputData,
    setAlert,
    BATCH_SIZE,
    setBatchedExtrinsics,
    setCurrentSendyProcess,
    explainers,
    setExplainers,
    selectedTokenSymbol,
    selectedTokenId,
    setDownloadData,
  } = useSendyProvider();

  const { rootApi } = useTrnApi();

  const [result, setResult] = useState<any>(null);
  const [rowCount, setRowCount] = useState<number>(0);
  const [addressList, setAddressList] = useState<string | null>(null);
  const [readyToPrepareData, setReadyToPrepareData] = useState<boolean>(false);

  const bulkAddressList: string | null = useDebounce(addressList, 500);

  const { tokensWithBalances } = useAccountProvider();

  const quickRowCount = useCallback((data: string) => {
    if (data) {
      const addressArray = data.split('\n');
      setRowCount(addressArray.length);
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: any[]) => {
      acceptedFiles.forEach((file: any) => {
        setReadyToPrepareData(false);
        setResult(null);

        const reader = new FileReader();

        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = () => {
          const fileContents = reader.result;

          try {
            const decoder = new TextDecoder('utf-8');
            if (fileContents instanceof ArrayBuffer) {
              // detect if the file is a JSON or CSV file and parse accordingly

              if (file.name.endsWith('.json')) {
                const fileData = decoder.decode(fileContents);
                setAddressList(JSON.parse(fileData));
                setInputData(fileData);
                quickRowCount(fileData);
                console.log('File is JSON', JSON.parse(fileData));
              } else if (file.name.endsWith('.csv')) {
                const fileData = decoder.decode(fileContents);
                setAddressList(fileData);
                setInputData(fileData);
                quickRowCount(fileData);
                console.log('File is CSV', fileData);
              }
              setReadyToPrepareData(true);
            }
          } catch (error) {
            console.error('Error parsing File', error);
          }
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [quickRowCount, setInputData]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handlePrepareData = useCallback(() => {
    if (bulkAddressList) {
      const addressArray: string[] = bulkAddressList.split('\n');

      if (addressArray.length > BATCH_SIZE) {
        setAlert(
          `We can only batch ${BATCH_SIZE} transactions in one go, please reduce your list to less than that to continue`,
          'Address list is too large'
        );
        return;
      }

      const batchedTx = [];
      const explainer = [];
      const downloadObjects = [];

      for (let i = 0; i < addressArray.length; i++) {
        const addressRow = addressArray[i];
        const address = addressRow?.split(',')[0]?.trim();
        const tokensToSend = addressRow?.split(',')[1]?.trim();

        const tokenDecimals = tokensWithBalances?.find(
          t => t.tokenId === selectedTokenId
        )?.decimals;

        const tokenValueToUse = utils.parseUnits(
          tokensToSend!.toString(),
          tokenDecimals
        );

        const downloadObj = {
          address,
          tokensToSend: tokenValueToUse.toString(),
        };
        downloadObjects.push(downloadObj);

        if (!address || !tokenValueToUse) {
          setAlert(
            `Invalid address or tokens to send detected at row ${i + 1}`,
            'Invalid Address'
          );
          return;
        }

        let extrinsic;
        if (selectedTokenId === 1) {
          extrinsic = rootApi.tx.balances.transfer(
            address,
            tokenValueToUse.toBigInt()
          );
        } else {
          extrinsic = rootApi.tx.assets.transfer(
            selectedTokenId,
            address,
            tokenValueToUse.toBigInt()
          );
        }

        batchedTx.push(extrinsic);

        explainer.push(
          `Sending ${tokensToSend} ${selectedTokenSymbol} to ${address}`
        );
      }

      setDownloadData(downloadObjects);
      setBatchedExtrinsics(batchedTx);
      setExplainers(explainer);
      setCurrentSendyProcess(SendyProcess.StageThree);
    }
  }, [
    bulkAddressList,
    BATCH_SIZE,
    setDownloadData,
    setBatchedExtrinsics,
    setExplainers,
    setCurrentSendyProcess,
    setAlert,
    tokensWithBalances,
    selectedTokenId,
    selectedTokenSymbol,
    rootApi.tx.assets,
    rootApi.tx.balances,
  ]);

  return (
    <>
      <div className="grid gap-4">
        <div className="grid gap-4">
          <label
            {...getRootProps()}
            className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 "
          >
            <div className=" text-center">
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold">Drag files</span>
              </p>
              <p className="text-xs text-gray-500">Click to upload files</p>
            </div>
          </label>

          <Input
            {...getInputProps()}
            id="dropzone-file"
            accept="application/json, text/csv"
            type="file"
            className="hidden"
          />
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <AutosizeTextarea
              onChange={e => {
                setAddressList(e.target.value);
                setInputData(e.target.value);
                if (e.target.value) {
                  setReadyToPrepareData(true);
                } else {
                  setReadyToPrepareData(false);
                  setResult(null);
                }
              }}
              value={bulkAddressList ?? ''}
              id="address"
              placeholder="Address List"
            />
            {rowCount && rowCount > 0 ? (
              <div className="text-xs uppercase tracking-wider">
                {rowCount} rows detected
              </div>
            ) : null}
          </div>
        </div>
        <div>
          <Button
            className="w-full dark:bg-sendyOpacity hover:bg-opacity-40 dark:hover:bg-opacity-40 transition-all duration-300 uppercase text-xs tracking-wider"
            onClick={() => handlePrepareData()}
            disabled={!readyToPrepareData}
          >
            Prepare Data
          </Button>
        </div>
      </div>
    </>
  );
}
