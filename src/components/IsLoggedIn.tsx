'use client';

import { useFutureverse } from '@futureverse/react';
import { type PropsWithChildren } from 'react';
import { MotionMain } from './Motion/MotionMain';
import { container, item } from './HomeContent';
import { MotionDiv } from './Motion/MotionDiv';

export default function IsLoggedIn({ children }: PropsWithChildren) {
  const { userSession, login } = useFutureverse();
  // useSignInHandler();

  if (!userSession) {
    return (
      <MotionMain
        className="mt-28 mb-16 w-full max-w-7xl mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
        exit="hidden"
      >
        <MotionDiv
          className="grid grid-cols-1 gap-8 cursor-pointer "
          onClick={() => login()}
        >
          <MotionDiv
            variants={item}
            className="py-16 px-4 md:py-32 md:px-8 bg-sendy bg-opacity-80 backdrop-blur-lg  rounded-lg justify-center items-center"
          >
            <div className="text-secondary text-[2.2rem] md:text-[3rem] text-center font-bold md:font-black leading-none p-2">
              Click To Connect & Sign In!
            </div>

            <div className="text-secondary text-[1.2rem] md:text-[1.6rem] text-center p-1 w-full md:w-1/2 mx-auto leading-8">
              In order to use Get Sendy, you need to connect your wallet and
              sign in to your FuturePass
            </div>
          </MotionDiv>
        </MotionDiv>
      </MotionMain>
    );
  }

  return <>{children}</>;
}
