import { useCreateBulkExtrinsic } from '@/hooks/useCreateBulkExtrinsic';
import { useSendyProvider } from '@/Providers/SendyProvider';
import { useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import Transactions from './Transactions';
import { useTxProvider } from '@/Providers/TxProvider';
import { AnimatePresence, motion } from 'framer-motion';
import type { ExtrinsicArray } from '@/types';

export default function TransactionsComp() {
  const { batchedSendys, setBatchedSendys, setAssetTotals, setSelectedPairs } =
    useSendyProvider();
  const { setShowGasModal } = useTxProvider();
  const { submitExtrinsic } = useCreateBulkExtrinsic();

  const extrinsics = useMemo(() => {
    if (batchedSendys.length === 0) {
      return [];
    }

    return batchedSendys.map(sendy => {
      return sendy.extrinsic;
    });
  }, [batchedSendys]);

  type SubEx = typeof submitExtrinsic;

  const handleSendNfts = async ({
    submitExtrinsic,
    extrinsics,
  }: {
    submitExtrinsic: SubEx;
    extrinsics: ExtrinsicArray;
  }) => {
    if (extrinsics.length === 0 || !extrinsics) {
      return;
    }

    await submitExtrinsic({ extrinsics });
  };

  const removeBatchedSendys = useCallback(() => {
    setBatchedSendys([]);
    setAssetTotals([]);
    setSelectedPairs([]);
  }, [setAssetTotals, setBatchedSendys, setSelectedPairs]);

  if (!extrinsics || extrinsics.length <= 0) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          layoutId="tx-header"
          key="tx-header"
          className="col-span-6 text-sendy font-bold "
        >
          Transaction List{' '}
          <span className="text-xs font-medium">(Drag to Reorder)</span>
        </motion.div>
        <motion.div
          layoutId="tx-clear"
          key="tx-clear"
          className=" py-1 px-2 dark:bg-sendyOpacity bg-foreground text-background rounded-lg font-bold inline-flex text-[10px] mt-1 cursor-pointer hover:bg-opacity-80 transition-all duration-300"
          onClick={() => removeBatchedSendys()}
        >
          CLEAR LIST
        </motion.div>

        <Transactions />

        <motion.div
          layoutId="tx-footer"
          key="tx-footer"
          className="grid grid-cols-1 gap-4 backdrop-blur-[6px] justify-between items-center p-3 bg-mutedOpacity bg-opacity-40 rounded-lg w-full z-10 relative mt-3"
        >
          <div className="grid grid-cols-4">
            <Button
              className="dark:bg-sendyOpacity hover:bg-opacity-40 dark:hover:bg-opacity-40  transition-all duration-300 w-full rounded-tr-none rounded-br-none col-span-3"
              onClick={() => handleSendNfts({ submitExtrinsic, extrinsics })}
            >
              Bulk Send Transactions
            </Button>
            <Button
              className="dark:bg-sendyOpacity bg-sendyOpacity dark:bg-opacity-20 bg-opacity-20 hover:bg-opacity-40 dark:hover:bg-opacity-40 text-foreground hover:text-white transition-all duration-300 w-full rounded-tl-none rounded-bl-none "
              onClick={() => setShowGasModal(true)}
            >
              {/* <EllipsisVertical /> */}
              <span className="text-xs uppercase ">Gas</span>
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
