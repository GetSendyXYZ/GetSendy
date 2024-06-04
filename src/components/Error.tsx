import React from 'react';

export default function ErrorComponent({
  title,
  message,
  children,
}: {
  title?: string;
  message?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen items-center justify-center -ml-4 -mt-4">
      <div className="grid w-full h-full bg-gray-800 backdrop-blur-lg border-[1px]  justify-center items-center">
        <div className="text-sendyOpacity flex flex-col items-center gap-3">
          <h1 className="text-[1rem] md:text-[1.2rem] text-center font-bold md:font-black leading-none">
            {title}
          </h1>
          <div className="p-2 text-center">{message}</div>
          {children}
          <div className="w-full text-center">
            <a
              className="text-base underline cursor-pointer"
              onClick={() => window.location.reload()}
            >
              Please Reload Application
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
