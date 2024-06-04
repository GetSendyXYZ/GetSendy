import React, { type PropsWithChildren } from 'react';
import Logo from './Logo';
import { cn } from '@/lib/utils';

export function Loader({
  children,
  classes,
}: PropsWithChildren & { classes?: string }) {
  return (
    <div
      className={cn('items-center justify-center bg-background', classes)}
      style={{ background: 'rgb(3, 7, 18)' }}
    >
      <div className="grid py-8 px-4 lg:py-12 lg:px-6 xl:py-16 xl:px-8 h-full w-full justify-center items-center">
        <div className="text-sendyOpacity flex flex-col items-center gap-3">
          {children}
        </div>
      </div>
    </div>
  );
}

Loader.Logo = function LoaderLogo() {
  return (
    <div className="text-sendyOpacity">
      <Logo />
    </div>
  );
};

Loader.Initialising = function LoaderInitialising() {
  return (
    <div className=" text-[1rem] md:text-[1.2rem] text-center font-bold md:font-black leading-none p-2">
      Initialising Root Network API
      <span className="animate-pulse delay-75">.</span>
      <span className="animate-pulse delay-150">.</span>
      <span className="animate-pulse delay-300">.</span>
    </div>
  );
};

Loader.Text = function LoadText({ text }: { text: string }) {
  return (
    <div className=" text-[1rem] md:text-[1.2rem] text-center font-bold md:font-black leading-none p-2">
      {text}
    </div>
  );
};

Loader.AnimatedText = function AnimatedText({ text }: { text: string }) {
  return (
    <div className=" text-[1rem] md:text-[1.2rem] text-center font-bold md:font-black leading-none p-2">
      {text}
      <span className="animate-pulse delay-75">.</span>
      <span className="animate-pulse delay-150">.</span>
      <span className="animate-pulse delay-300">.</span>
    </div>
  );
};

Loader.Content = function LoaderContent({ children }: PropsWithChildren) {
  return <div className="p-2">{children}</div>;
};
