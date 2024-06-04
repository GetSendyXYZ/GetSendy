/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ExtrinsicPayload } from '@futureverse/mint-sdk';
import React, { useMemo } from 'react';

import { hexToString } from 'viem';

const hexKeyList = ['name', 'metadata_scheme'];

export default function TxPayload({
  txPayload,
}: {
  txPayload: ExtrinsicPayload;
}) {
  const renderPayload = useMemo(() => {
    const payload = txPayload.trnPayload.toJSON();
    return {
      address: payload.address?.toString(),
      blockHash: payload.blockHash?.toString(),
      blockNumber: payload.blockNumber?.toString(),
      genesisHash: payload.genesisHash?.toString(),
      method: payload.method,
      nonce: payload.nonce?.toString(),
    };
  }, [txPayload.trnPayload]);
  return <DataTableFromObject renderPayload={renderPayload} />;
}

const DataTableFromObject = ({ renderPayload }: { renderPayload: any }) => {
  return renderPayload !== null ? (
    Object.keys(renderPayload).map((key: any, index: number) => {
      return (
        <div
          key={'key-' + index.toString()}
          className="flex flex-col last-of-type:mb-0 last-of-type:pb-0 text-primary dark:text-secondary w-full"
        >
          <div className="font-bold text-sm font-sans leading-none p-2 pr-0 bg-gray-300 rounded-lg text-primary dark:text-secondary">
            {key}
          </div>
          <div className="break-all whitespace-break-spaces text-sm pre leading-none p-2 pr-0 rounded-lg last-of-type:mb-0 text-primary dark:text-secondary font-mono">
            {typeof renderPayload[key] === 'object' &&
            typeof renderPayload[key] !== null ? (
              <DataTableFromObject renderPayload={renderPayload[key]} />
            ) : renderPayload[key]?.toString().includes('0x') &&
              hexKeyList.includes(key) ? (
              <div className="p-2 bg-gray-100 rounded-lg mb-2 ">
                {hexToString(renderPayload[key].toString())}
              </div>
            ) : (
              <div className="p-2 bg-gray-100 rounded-lg mb-2 ">
                {renderPayload[key]}
              </div>
            )}
          </div>
        </div>
      );
    })
  ) : (
    <></>
  );
};
