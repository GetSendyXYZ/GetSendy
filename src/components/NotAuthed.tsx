import { useWalletProvider } from '@/Providers/WalletProvider';
import { useAccount } from 'wagmi';
import { Button } from './ui/button';
import { useFutureverse } from '@futureverse/react';

export default function NotAuthed() {
  const { status: accountStatus } = useAccount();
  const { handleLogin } = useWalletProvider();
  const { userSession } = useFutureverse();

  return (
    <main className="mt-28 pt-2">
      <div className="max-w-xl mx-auto">
        <div className="text-center text-lg p-6 mt-4 bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-lg text-white dark:text-primary">
          <div className="mb-4 text-lg px-8 ">
            You must be connect and authenticate your wallet to use GetSendy!
          </div>
          {accountStatus === 'disconnected' && (
            <Button
              className="dark:bg-sendyOpacity hover:bg-opacity-40 dark:hover:bg-opacity-40 transition-all duration-300 uppercase text-xs tracking-wider"
              onClick={() => open()}
            >
              Connect Wallet
            </Button>
          )}
          {accountStatus === 'connected' && !userSession && (
            <Button
              className="dark:bg-sendyOpacity hover:bg-opacity-40 dark:hover:bg-opacity-40 transition-all duration-300 uppercase text-xs tracking-wider"
              onClick={() => handleLogin()}
            >
              Log In
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
