import { useFutureverse, UserState } from '@futureverse/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAccount } from 'wagmi';

export const FV_AUTH_SILENT_LOGIN_KEY = 'get-sendy-silent-login-key';
export const FV_AUTH_PREV_PATH_KEY = 'get-sendy-path-key';

export function useSignInHandler() {
  const { login, authClient, userSession } = useFutureverse();
  const { address: accountAddress } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (userSession) {
      const prevPath = sessionStorage.getItem(FV_AUTH_PREV_PATH_KEY);
      router.push(prevPath ?? '/app');
    }
  }, [router, userSession]);

  useEffect(() => {
    const userStateChange = (userState: UserState) => {
      if (userState === UserState.SignedIn) {
        sessionStorage.setItem(FV_AUTH_SILENT_LOGIN_KEY, 'enabled');
      }
      if (userState === UserState.SignedOut) {
        const silentAuth = sessionStorage.getItem(FV_AUTH_SILENT_LOGIN_KEY);
        const isSilent = silentAuth !== 'disabled';
        if (!isSilent) {
          sessionStorage.setItem(FV_AUTH_PREV_PATH_KEY, pathname);
        }
        login(
          isSilent
            ? {
                loginMethod: {
                  type: 'silent',
                  targetEOA: accountAddress ?? null,
                },
              }
            : undefined
        );
      }
      if (userState === UserState.SignInFailed) {
        sessionStorage.setItem(FV_AUTH_SILENT_LOGIN_KEY, 'disabled');
        login();
      }
    };
    authClient.addUserStateListener(userStateChange);
    return () => {
      authClient.removeUserStateListener(userStateChange);
    };
  }, [accountAddress, authClient, login, pathname, router]);
}
