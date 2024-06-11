'use client';

import AirdropNft from '@/components/AirdropNft';
import AirdropTokens from '@/components/AirdropTokens';
import ComingSoon from '@/components/ComingSoon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function Sendy() {
  const params = useSearchParams();
  const tab = params.get('tab');

  const [title, setTile] = useState<string>(tab === 'nft' ? 'NFTs' : 'Tokens');

  return (
    <main>
      <div className="max-w-screen-lg mx-auto ">
        <div className="grid  grid-cols-1 lg:grid-cols-12 gap-9">
          <h1
            className={`lg:col-span-8 lg:col-start-3 text-sendy text-[1.6rem] md:text-[2rem] text-start font-bold md:font-black leading-none mb-4`}
          >
            Airdrop {title}
          </h1>
        </div>
        <AnimatePresence>
          <motion.div className={`grid  grid-cols-1 lg:grid-cols-12 gap-9`}>
            {/* className={`lg:col-span-8 ${batchedSendys.length === 0 ? 'lg:col-start-3' : 'lg:col-start-0'}`} */}
            <motion.div className={`lg:col-span-8 lg:col-start-3 mb-16`}>
              <Tabs defaultValue={tab ?? 'token'} className="w-full">
                <TabsList className="mb-3 w-full flex gap-2 h-14 p-2 bg-muted">
                  <TabsTrigger
                    value="token"
                    className="flex-grow flex-shrink h-full bg-sendyOpacity bg-opacity-15 data-[state=active]:dark:bg-sendyOpacity data-[state=active]:text-background  hover:bg-gray-200 hover:bg-opacity-10 transition-all duration-300"
                    onClick={() => setTile('Tokens')}
                  >
                    Tokens
                  </TabsTrigger>
                  <TabsTrigger
                    value="nft"
                    className="flex-grow flex-shrink h-full bg-sendyOpacity bg-opacity-15 data-[state=active]:dark:bg-sendyOpacity data-[state=active]:text-background  hover:bg-gray-200 hover:bg-opacity-10 transition-all duration-300"
                    onClick={() => setTile('NFTs')}
                  >
                    NFTs
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="token">
                  <AirdropTokens />
                </TabsContent>
                <TabsContent value="nft">
                  <AirdropNft />
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* {batchedSendys.length > 0 ? (
              <motion.div className="lg:col-span-4 max-h-[calc(100vh-10rem-120px-120px)] ">
                <TransactionsComp />
              </motion.div>
            ) : null} */}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
