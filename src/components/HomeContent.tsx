import React from 'react';
import { MotionDiv } from '@/components/Motion/MotionDiv';
import { MotionLink } from '@/components/Motion/MotionLink';
import { MotionMain } from '@/components/Motion/MotionMain';
import { env } from '@/env';
import type { Variants } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';

export const container: Variants = {
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

export const item: Variants = {
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

export function HomeContent() {
  return (
    <MotionMain
      className="mt-28 pb-16 w-full max-w-7xl mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
      exit="hidden"
    >
      <MotionDiv className="grid grid-cols-1 gap-8">
        <MotionDiv
          variants={item}
          className="  py-16 px-4 md:py-32 md:px-8 bg-sendy bg-opacity-80 backdrop-blur-lg  rounded-lg justify-center items-center"
        >
          <div className="text-secondary text-[2.2rem] md:text-[3rem] text-center font-bold md:font-black leading-none p-2">
            Welcome to Get Sendy
          </div>
          <div className="text-secondary text-[1.2rem] md:text-[1.6rem] text-center p-1 w-full md:w-1/2 mx-auto leading-8">
            Whether you want to airdrop that new meme coin or send some NFTs and
            tokens to your mates on The Root Network, Get Sendy is the place to
            do it.
          </div>
        </MotionDiv>
      </MotionDiv>
      <MotionDiv
        variants={container}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8"
      >
        <MotionDiv
          variants={item}
          className="col-span-1 md:col-span-3 lg:col-span-1"
        >
          <div className="grid py-8 px-4 lg:py-12 lg:px-6 xl:py-16 xl:px-8 bg-sendy bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent  rounded-lg justify-items-center md:justify-items-start items-center">
            <div className="text-secondary text-[1.6rem] md:text-[2rem] text-center md:text-start font-bold md:font-black leading-none p-2 flex flex-col md:flex-row justify-items-center md:justify-items-start items-center">
              <div className="mr-0 mb-2 md:mb-0 md:mr-2">Bulk Sending</div>
              <ArrowRight className="hidden md:flex " />
            </div>
            <div className="text-secondary text-center md:text-start leading-[1.1rem] p-2 flex flex-col md:flex-row justify-items-center md:justify-items-start items-center">
              Perfect for sending tokens to a smaller group of people at once
              across multiple collections or assets
            </div>
            <ArrowDown className="mt-4 flex md:hidden text-primary dark:text-secondary " />
          </div>
        </MotionDiv>
        <MotionLink variants={item} href="/sendy?tab=token" className="h-full">
          <div className="grid py-8 px-4 lg:py-12 lg:px-6 xl:py-16 xl:px-8 h-full bg-gray-800 bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent hover:border-sendy transition-all duration-300 ease-in-out rounded-lg justify-center items-center">
            <div className="text-sendy text-[1.6rem] md:text-[2rem] text-center font-bold md:font-black leading-none p-2">
              Send Tokens
            </div>
          </div>
        </MotionLink>
        <MotionLink variants={item} href="/sendy?tab=nft" className="h-full">
          <div className="grid py-8 px-4 lg:py-12 lg:px-6 xl:py-16 xl:px-8 h-full bg-gray-800 bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent hover:border-sendy transition-all duration-300 ease-in-out rounded-lg justify-center items-center">
            <div className="text-sendy text-[1.6rem] md:text-[2rem] text-center font-bold md:font-black leading-none p-2">
              Send NFTS
            </div>
          </div>
        </MotionLink>
        <MotionLink
          variants={item}
          href="/sendy?tab=token"
          className="h-full opacity-50 cursor-not-allowed"
        >
          <div className="grid py-8 px-4 lg:py-12 lg:px-6 xl:py-16 xl:px-8 h-full bg-gray-800 bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent hover:border-sendy transition-all duration-300 ease-in-out rounded-lg justify-center items-center">
            <div className="text-sendy text-[1.6rem] md:text-[2rem] text-center font-bold md:font-black leading-none p-2">
              Send SFTs
              <br />
              <span className="text-sm">(coming soon)</span>
            </div>
          </div>
        </MotionLink>

        {env.NEXT_PUBLIC_NETWORK === 'porcini' && (
          <>
            <MotionDiv className="col-span-1 md:col-span-3 lg:col-span-1">
              <MotionDiv
                variants={item}
                className="grid py-8 px-4 lg:py-12 lg:px-6 xl:py-16 xl:px-8 bg-sendy bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent  rounded-lg justify-items-center md:justify-items-start items-center"
              >
                <div className="text-secondary text-[1.6rem] md:text-[2rem] text-center md:text-start font-bold md:font-black leading-none p-2 flex flex-col md:flex-row justify-items-center md:justify-items-start items-center">
                  <div className="mr-0 mb-2 md:mb-0 md:mr-2">Incinerate</div>
                  <ArrowRight className="hidden md:flex " />
                </div>
                <div className="text-secondary text-center md:text-start leading-[1.1rem] p-2 flex flex-col md:flex-row items-center">
                  Do you have a bunch of tokens or NFTs you want to get rid of
                  on testnet? Use this feature to burn them.
                </div>
                <ArrowDown className="mt-4 flex md:hidden text-primary dark:text-secondary" />
              </MotionDiv>
            </MotionDiv>
            <MotionLink
              variants={item}
              href="/incinerate"
              className="h-full col-span-1 md:col-span-3"
            >
              <div className="grid py-8 px-4 lg:py-12 lg:px-6 xl:py-16 xl:px-8 h-full bg-gray-800 bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent hover:border-sendy transition-all duration-300 ease-in-out rounded-lg justify-center items-center">
                <div className="text-sendy text-[1.6rem] md:text-[2rem] text-center font-bold md:font-black leading-none p-2">
                  Burn Tokens
                </div>
              </div>
            </MotionLink>
          </>
        )}
        <MotionDiv
          variants={item}
          className="col-span-1 md:col-span-3 lg:col-span-1"
        >
          <div className="grid py-8 px-4 lg:py-12 lg:px-6 xl:py-16 xl:px-8 bg-sendy bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent  rounded-lg justify-items-center md:justify-items-start items-center">
            <div className="text-secondary text-[1.6rem] md:text-[2rem] text-center md:text-start font-bold md:font-black leading-none p-2 flex flex-col md:flex-row justify-items-center md:justify-items-start items-center">
              <div className="mr-0 mb-2 md:mb-0 md:mr-2">Airdrops</div>
              <ArrowRight className="hidden md:flex " />
            </div>
            <div className="text-secondary text-center md:text-start leading-[1.1rem] p-2 flex flex-col md:flex-row items-center">
              Perfect for sending tokens to a large group of people at once from
              a single collection or asset
            </div>
            <ArrowDown className="mt-4 flex md:hidden text-primary dark:text-secondary" />
          </div>
        </MotionDiv>
        <MotionLink
          variants={item}
          href="/airdrop?tab=token"
          className="h-full opacity-50 cursor-not-allowed"
        >
          <div className="grid py-8 px-4 lg:py-12 lg:px-6 xl:py-16 xl:px-8 h-full bg-gray-800 bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent hover:border-sendy transition-all duration-300 ease-in-out rounded-lg justify-center items-center">
            <div className="text-sendy text-[1.6rem] md:text-[2rem] text-center font-bold md:font-black leading-none p-2">
              Airdrop Tokens
              <br />
              <span className="text-sm">(coming soon)</span>
            </div>
          </div>
        </MotionLink>
        <MotionLink
          variants={item}
          href="/airdrop?tab=nft"
          className="h-full opacity-50 cursor-not-allowed"
        >
          <div className="grid py-8 px-4 lg:py-12 lg:px-6 xl:py-16 xl:px-8 h-full bg-gray-800 bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent hover:border-sendy transition-all duration-300 ease-in-out rounded-lg justify-center items-center">
            <div className="text-sendy text-[1.6rem] md:text-[2rem] text-center font-bold md:font-black leading-none p-2">
              Airdrop NFTS
              <br />
              <span className="text-sm">(coming soon)</span>
            </div>
          </div>
        </MotionLink>
        <MotionLink
          variants={item}
          href="/airdrop?tab=token"
          // href="/airdrop?tab=sft"
          className="h-full opacity-50 cursor-not-allowed"
        >
          <div className="grid py-8 px-4 lg:py-12 lg:px-6 xl:py-16 xl:px-8 h-full bg-gray-800 bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent hover:border-sendy transition-all duration-300 ease-in-out rounded-lg justify-center items-center">
            <div className="text-sendy text-[1.6rem] md:text-[2rem] text-center font-bold md:font-black leading-none p-2">
              Airdrop SFTs
              <br />
              <span className="text-sm">(coming soon)</span>
            </div>
          </div>
        </MotionLink>
        {/* <Link href="/sendy/sft">
          <div className="grid py-8 px-4 lg:py-12 lg:px-6 xl:py-16 xl:px-8 bg-gray-800 bg-opacity-80 backdrop-blur-lg border-[1px] border-transparent hover:border-sendy transition-all duration-300 ease-in-out rounded-lg justify-center items-center">
            <div className="text-sendy text-[1.6rem] md:text-[2rem] text-center font-bold md:font-black leading-none p-2">
              Send SFTS
            </div>
          </div>
        </Link> */}
      </MotionDiv>
    </MotionMain>
  );
}
