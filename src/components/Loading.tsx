import React from 'react';

export default function Loading() {
  return (
    <main className="mt-28 pt-2">
      <div className="max-w-xl mx-auto">
        <div className="text-center text-lg p-5 mt-4 bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-lg text-white dark:text-primary">
          <div className="text-center uppercase text-xs tracking-wider">
            Loading...
          </div>
        </div>
      </div>
    </main>
  );
}
