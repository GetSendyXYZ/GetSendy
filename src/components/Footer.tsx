import React from 'react';

export default function Footer() {
  return (
    <div className="fixed bottom-0 flex flex-col w-screen z-10 min-h-[50vh] bg-background left-0">
      <div className="bg-mutedOpacity bg-opacity-50 p-2 lg:p-8 flex-grow ">
        <div className="grid grid-cols-3"></div>
        <div className="grid grid-cols-3"></div>
      </div>
      <div className="bg-mutedOpacity bg-opacity-100 pl-2 pr-2 lg:pl-8 lg:pr-8 lg:h-[45px] h-[90px] flex-grow-0 flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 justify-center items-center w-full">
          <div className=" block text-center lg:text-start text-primary uppercase font-bold tracking-wider text-xs mb-2 lg:mb-0">
            Use at your own risk... We are not responsible for any lost tokens
          </div>
          <div className="block text-center lg:text-end  text-primary uppercase font-bold tracking-wider text-xs mb-2 lg:mb-0">
            ©{new Date().getFullYear()} Get Sendy
          </div>
        </div>
      </div>
    </div>
  );
}
