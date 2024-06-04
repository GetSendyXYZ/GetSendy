import { useSendyProvider } from '@/Providers/SendyProvider';
import { AnimatePresence, Reorder, useDragControls } from 'framer-motion';
// import { shortenAddress } from '@/utils';
import { useMemo, type PropsWithChildren } from 'react';
import { useMotionValue } from 'framer-motion';
import { useRaisedShadow } from '@/hooks/useRaisedShadow';
import TransactionData from './Transactions/TransactionData';
import type { Sendy } from '@/types';
// import { ReorderIcon } from './Icon';

export default function Transactions() {
  const { batchedSendys, setBatchedSendys } = useSendyProvider();

  const randomInt = useMemo(() => Math.floor(Math.random() * 1000), []);

  return (
    <Reorder.Group
      onReorder={setBatchedSendys}
      values={batchedSendys}
      layoutScroll
      layout
      className="select-none lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-full max-h-none overflow-visible h-auto scroll-bar-gutter text-foreground"
      layoutId="tx-transactions"
      key="tx-transactions"
    >
      <AnimatePresence>
        {batchedSendys &&
          batchedSendys.length > 0 &&
          batchedSendys.map((sendy: Sendy, index: number) => (
            <Item
              index={index}
              layoutKey={`batched-layout-tx-${sendy.addedId}-${randomInt}-${sendy?.tokenIds?.[0] ?? sendy.assetId}`}
              key={`batched-tx-${sendy.addedId}-${randomInt}-${sendy?.tokenIds?.[0] ?? sendy.assetId}`}
              // layoutId={`batched-tx-${sendy.addedId}`}
              sendy={sendy}
            />
          ))}
      </AnimatePresence>
    </Reorder.Group>
  );
}

const Item = ({
  index,
  sendy,
  layoutKey,
}: PropsWithChildren & {
  index: number;
  sendy: Sendy;
  layoutKey: string;
}) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      key={layoutKey}
      value={sendy}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="cursor-pointer relative text-foreground"
      dragElastic={3}
      style={{ boxShadow }}
      dragListener={false}
      dragControls={dragControls}
      layoutId={layoutKey}
    >
      <TransactionData
        sendy={sendy}
        index={index}
        dragControls={dragControls}
      />
      {/* {children}
      <ReorderIcon dragControls={dragControls} /> */}
    </Reorder.Item>
  );
};
