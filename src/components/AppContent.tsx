import { MotionDiv } from '@/components/Motion/MotionDiv';
import { MotionLink } from '@/components/Motion/MotionLink';
import { MotionMain } from '@/components/Motion/MotionMain';
import { env } from '@/env';
import type { Variants } from 'framer-motion';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      type: 'spring',
      stiffness: 700,
      damping: 200,
      bounce: 0.25,
      mass: 0.5,
    },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: -60,
    transition: {
      duration: 0.6,
      type: 'spring',
      stiffness: 700,
      damping: 200,
      bounce: 0.25,
      mass: 0.5,
    },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      type: 'spring',
      stiffness: 700,
      damping: 200,
      bounce: 0.25,
      mass: 0.5,
    },
  },
};

export function AppContent() {
  return (
    <MotionMain
      className="mt-28 mb-16 w-full max-w-7xl mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
      exit="hidden"
    >
      <MotionDiv
        variants={container}
        className={`grid grid-cols-1 ${env.NEXT_PUBLIC_NETWORK === 'porcini' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-8 mt-8 items-start`}
      >
        <MotionDiv variants={container} className="grid grid-cols-1 gap-8 mt-8">
          <MotionDiv variants={item}>
            <div className="grid p-2 bg-sendy bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent  rounded-lg justify-items-center md:justify-items-start items-center">
              <div className="text-secondary text-[1rem] md:text-[1.2rem] text-center md:text-start font-bold md:font-black leading-none p-2 flex flex-col md:flex-row justify-items-center md:justify-items-start items-center">
                <div className="mr-0 mb-2 md:mb-0 md:mr-2">Bulk Sending</div>
              </div>
            </div>
          </MotionDiv>
          <MotionLink
            variants={item}
            href="/sendy?tab=token"
            className="h-full"
          >
            <div className="grid px-2 py-8 h-full bg-gray-800 bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent hover:border-sendy transition-all duration-300 ease-in-out rounded-lg justify-center items-center">
              <div className="text-background dark:text-sendy text-[1.6rem] md:text-[2rem] text-center font-bold md:font-black leading-none p-2">
                Send Tokens
              </div>
            </div>
          </MotionLink>
          <MotionLink variants={item} href="/sendy?tab=nft" className="h-full">
            <div className="grid px-2 py-8 h-full bg-gray-800 bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent hover:border-sendy transition-all duration-300 ease-in-out rounded-lg justify-center items-center">
              <div className="text-background dark:text-sendy text-[1.6rem] md:text-[2rem] text-center font-bold md:font-black leading-none p-2">
                Send NFTS
              </div>
            </div>
          </MotionLink>
          <MotionLink
            variants={item}
            href="/sendy?tab=token"
            className="h-full opacity-50 cursor-not-allowed"
          >
            <div className="grid px-2 py-8 h-full bg-gray-800 bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent hover:border-sendy transition-all duration-300 ease-in-out rounded-lg justify-center items-center opacity-20">
              <div className="text-background dark:text-sendy text-[1.6rem] md:text-[2rem] text-center font-bold md:font-black leading-none p-2">
                Send SFTs
                <br />
                <span className="text-sm">(coming soon)</span>
              </div>
            </div>
          </MotionLink>
        </MotionDiv>

        {env.NEXT_PUBLIC_NETWORK === 'porcini' && (
          <>
            <MotionDiv
              variants={container}
              className="grid grid-cols-1 gap-8 mt-8"
            >
              <MotionDiv variants={item}>
                <div className="grid p-2 bg-sendy bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent  rounded-lg justify-items-center md:justify-items-start items-center">
                  <div className="text-secondary text-[1rem] md:text-[1.2rem] text-center md:text-start font-bold md:font-black leading-none p-2 flex flex-col md:flex-row justify-items-center md:justify-items-start items-center">
                    <div className="mr-0 mb-2 md:mb-0 md:mr-2">Incinerate</div>
                  </div>
                </div>
              </MotionDiv>
              <MotionLink
                variants={item}
                href="/incinerate"
                className="h-full "
              >
                <div className="grid px-2 py-8 h-full bg-gray-800 bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent hover:border-sendy transition-all duration-300 ease-in-out rounded-lg justify-center items-center">
                  <div className="text-background dark:text-sendy text-[1.6rem] md:text-[2rem] text-center font-bold md:font-black leading-none p-2">
                    Burn Tokens
                  </div>
                </div>
              </MotionLink>
            </MotionDiv>
          </>
        )}
        <MotionDiv variants={container} className="grid grid-cols-1 gap-8 mt-8">
          <MotionDiv variants={item}>
            <div className="grid p-2 bg-sendy bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent  rounded-lg justify-items-center md:justify-items-start items-center">
              <div className="text-secondary text-[1rem] md:text-[1.2rem] text-center md:text-start font-bold md:font-black leading-none p-2 flex flex-col md:flex-row justify-items-center md:justify-items-start items-center">
                <div className="mr-0 mb-2 md:mb-0 md:mr-2">Airdrops</div>
              </div>
            </div>
          </MotionDiv>
          <MotionLink
            variants={item}
            href="/airdrop?tab=token"
            className="h-full"
          >
            <div className="grid px-2 py-8 h-full bg-gray-800 bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent hover:border-sendy transition-all duration-300 ease-in-out rounded-lg justify-center items-center">
              <div className="text-background dark:text-sendy text-[1.6rem] md:text-[2rem] text-center font-bold md:font-black leading-none p-2">
                Airdrop Tokens
              </div>
            </div>
          </MotionLink>
          <MotionLink
            variants={item}
            href="/airdrop?tab=nft"
            className="h-full"
          >
            <div className="grid px-2 py-8 h-full bg-gray-800 bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent hover:border-sendy transition-all duration-300 ease-in-out rounded-lg justify-center items-center">
              <div className="text-background dark:text-sendy text-[1.6rem] md:text-[2rem] text-center font-bold md:font-black leading-none p-2">
                Airdrop NFTS
              </div>
            </div>
          </MotionLink>
          <MotionLink
            variants={item}
            href="/airdrop?tab=token"
            // href="/airdrop?tab=sft"
            className="h-full opacity-50 cursor-not-allowed"
          >
            <div className="grid px-2 py-8 h-full bg-gray-800 bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent hover:border-sendy transition-all duration-300 ease-in-out rounded-lg justify-center items-center opacity-20">
              <div className="text-background dark:text-sendy text-[1.6rem] md:text-[2rem] text-center font-bold md:font-black leading-none p-2">
                Airdrop SFTs
                <br />
                <span className="text-sm">(coming soon)</span>
              </div>
            </div>
          </MotionLink>
        </MotionDiv>

        {/* <Link href="/sendy/sft">
          <div className="grid px-2 py-8 bg-gray-800 bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent hover:border-sendy transition-all duration-300 ease-in-out rounded-lg justify-center items-center">
            <div className="text-background dark:text-sendy text-[1.6rem] md:text-[2rem] text-center font-bold md:font-black leading-none p-2">
              Send SFTS
            </div>
          </div>
        </Link> */}
      </MotionDiv>
    </MotionMain>
  );
}
