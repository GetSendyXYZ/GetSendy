import type { Sendy } from '@/types';
import { motion } from 'framer-motion';

import React from 'react';

export default function TransferNft({
  sendy,
  toggleOpen,
}: {
  sendy: Sendy;
  toggleOpen: boolean;
}) {
  return (
    <>
      <motion.div
        className={`${toggleOpen ? 'col-span-1' : 'col-span-3'}`}
        layout="position"
        key="nft-col-col"
      >
        <div className="mb-1 text-[10px] uppercase tracking-widest font-bold">
          Coll
        </div>
        <div
          className={`p-2 bg-muted w-full rounded-md font-mono text-xs whitespace-nowrap ${toggleOpen ? 'overflow-auto' : 'overflow-scroll'} scroll-pb-5 scroll-bar-gutter`}
        >
          {sendy.collectionName}{' '}
          <span className="text-[10px]">({sendy.collectionId})</span>
        </div>
      </motion.div>
      <motion.div
        className={`${toggleOpen ? 'col-span-1' : 'col-span-4'}`}
        layout="position"
        key="nft-col-token"
      >
        <div className="mb-1 text-[10px] uppercase tracking-widest font-bold">
          Ids
        </div>
        <div
          className={`p-2 bg-muted w-full rounded-md font-mono text-xs whitespace-nowrap ${toggleOpen ? 'overflow-auto' : 'overflow-scroll'} scroll-pb-5 scroll-bar-gutter`}
        >
          {sendy?.tokenIds?.join(', ')}
        </div>
      </motion.div>
    </>
  );
}
