import { useAccountProvider } from '@/Providers/AccountProvider';
import type { Sendy } from '@/types';

import { motion } from 'framer-motion';

export default function TransferAsset({
  sendy,
  toggleOpen,
}: {
  sendy: Sendy;
  toggleOpen: boolean;
}) {
  const { tokensWithBalances } = useAccountProvider();

  return (
    <>
      <motion.div
        className={`${toggleOpen ? 'col-span-1' : 'col-span-3'}`}
        layout="position"
        key="token-col-asset"
      >
        <div className="mb-1 text-[10px] uppercase tracking-widest font-bold">
          Asset
        </div>
        <div
          className={`p-2 bg-muted w-full rounded-md font-mono text-xs whitespace-nowrap ${toggleOpen ? 'overflow-auto' : 'overflow-scroll'} scroll-pb-5 scroll-bar-gutter`}
        >
          {tokensWithBalances?.find(t => t.tokenId === sendy.assetId)?.slug} (
          <span className="text-[10px]">{sendy.assetId})</span>
        </div>
      </motion.div>
      <motion.div
        className={`${toggleOpen ? 'col-span-1' : 'col-span-4'}`}
        layout="position"
        key="token-col-token"
      >
        <div className="mb-1 text-[10px] uppercase tracking-widest font-bold">
          Qty
        </div>
        <div
          className={`p-2 bg-muted w-full rounded-md font-mono text-xs whitespace-nowrap ${toggleOpen ? 'overflow-auto' : 'overflow-scroll'} scroll-pb-5 scroll-bar-gutter`}
        >
          {sendy?.amountToSend}
        </div>
      </motion.div>
    </>
  );
}
