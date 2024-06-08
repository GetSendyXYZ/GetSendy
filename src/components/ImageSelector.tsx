/* eslint-disable @next/next/no-img-element */
'use client';

import {
  type PropsWithChildren,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { type Option } from './ui/multiple-selector';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { NftMetadata } from '@/types';
import { Dialog, DialogContent } from './ui/dialog';

export default function ImageSelector({
  tokens,
  metadataUrl,
  values,
  setValues,
}: {
  tokens: Array<{ id: number }>;
  metadataUrl: string;
  values: Array<Option>;
  setValues: Dispatch<SetStateAction<Option[]>>;
}) {
  const ITEMS_PER_PAGE = 30;

  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedTokens = tokens.slice(startIndex, endIndex);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const paginationContent = (
    <div className="grid grid-cols-3 justify-center items-center">
      <button
        className="py-2 bg-transparent text-foreground rounded-md mr-2 opacity-60 hover:opacity-100 transition-opacity duration-300 uppercase tracking-widest text-sm text-start"
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
      >
        ← Previous Page
      </button>
      <span className="py-2 bg-transparent text-foreground rounded-md mr-2 opacity-60 transition-opacity duration-300 uppercase tracking-widest text-[0.8rem] text-center">
        {startIndex + 1}-{endIndex >= tokens.length ? tokens.length : endIndex}{' '}
        of {tokens.length}
      </span>
      <button
        className="py-2 bg-transparent text-foreground rounded-md opacity-60 hover:opacity-100 transition-opacity duration-300 uppercase tracking-widest text-sm text-end"
        onClick={handleNextPage}
        disabled={endIndex >= tokens.length}
      >
        Next Page →
      </button>
    </div>
  );

  return (
    <div>
      {paginationContent}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2 mb-2 max-h-[40vh] overflow-y-scroll scroll-pr-6">
        {paginatedTokens.map(token => (
          <ImageItem
            key={token.id}
            token={token.id}
            metadataUrl={metadataUrl}
            selected={
              values.find(v => Number(v.value) === token.id) !== undefined
            }
            onChange={value => {
              setValues(values => {
                const index = values.findIndex(
                  v => Number(v.value) === token.id
                );
                if (index === -1) {
                  return [...values, value];
                } else {
                  return [
                    ...values.slice(0, index),
                    ...values.slice(index + 1),
                  ];
                }
              });
            }}
          />
        ))}
      </div>
      {paginationContent}
    </div>
  );
}

export function ImageItem({
  token,
  metadataUrl,
  selected,
  onChange,
}: {
  token: number;
  metadataUrl: string;
  selected: boolean;
  onChange: (value: Option) => void;
}) {
  const [showMetaModal, setShowMetaModal] = useState(false);

  const getRawMetadata = async () => {
    const res = await fetch(`${metadataUrl}/${token}`);
    const metadata = (await res.json()) as NftMetadata;
    return metadata;
  };

  const { data: metadata, isFetching } = useQuery({
    queryKey: ['image', metadataUrl, token],
    queryFn: getRawMetadata,
  });

  if (isFetching) {
    return (
      <div className="w-full relative p-2 aspect-square ">
        <div className="absolute w-full h-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div
      className={`w-full cursor-pointer flex flex-col overflow-hidden ${!selected ? 'bg-mutedOpacity text-foreground' : 'bg-sendyOpacity text-black'} bg-opacity-100 rounded-lg  hover:border-sendyPrimary hover:bg-sendyOpacity hover:bg-opacity-65 transition-colors duration-200`}
      onClick={() =>
        onChange({ value: token.toString(), label: token.toString() })
      }
    >
      <div
        className={`image-wrap p-2 relative aspect-square border-4 border-sendyOpacity  ${!selected ? 'border-opacity-0' : 'border-opacity-100'} `}
      >
        <img
          src={metadata?.image ?? '/images/placeholder.png'}
          alt={`ID ${token}`}
          className="object-cover w-full h-full absolute inset-0 z-0"
        />
        <div
          onClick={() => setShowMetaModal(!showMetaModal)}
          className="absolute leading-0 top-2 right-2 z-10 flex py-1 px-2 text-[9px] uppercase text-black tracking-wider cursor-pointer rounded-lg bg-white hover:bg-sendy hover:text-background transition-all duration-300 ease-in-out w-auto"
        >
          Show Attributes
        </div>
      </div>
      <div className="flex justify-between items-center p-2 pb-0">
        <span>ID {token}</span>
      </div>
      {metadata && (
        <div className="flex flex-row content-start p-2 -mt-2">
          <MetadataModal
            showMetaModal={showMetaModal}
            setShowMetaModal={setShowMetaModal}
          >
            <div className="flex flex-col ">
              <h2 className="text-sendy text-[1.2rem] md:text-[1.3rem] text-start font-bold md:font-black leading-none mb-4">
                Metadata Attributes
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {metadata.attributes
                  ?.filter((attr: { value: string }) => attr.value !== '')
                  .map((attr: { trait_type: string; value: string }) => (
                    <div
                      key={attr.trait_type}
                      className="grid grid-cols-1 p-2 bg-muted rounded-lg"
                    >
                      <span className="uppercase text-xs tracking-wider text-sendyOpacity">
                        {attr.trait_type}
                      </span>
                      <span>{attr.value}</span>
                    </div>
                  ))}
              </div>
            </div>
          </MetadataModal>
        </div>
      )}
    </div>
  );
}

export const MetadataModal = ({
  children,
  showMetaModal,
  setShowMetaModal,
}: PropsWithChildren<{
  showMetaModal: boolean;
  setShowMetaModal: Dispatch<SetStateAction<boolean>>;
}>) => {
  return (
    <Dialog open={showMetaModal} onOpenChange={setShowMetaModal}>
      <DialogContent
        className={`sm:max-w-[425px] backdrop-blur-[6px] justify-between items-center p-4 bg-mutedOpacity bg-opacity-60 rounded-lg grid grid-cols-1 w-full`}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};
