// import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
// import { http, createConfig, cookieStorage, createStorage } from 'wagmi';
// import { walletConnect, coinbaseWallet, injected } from 'wagmi/connectors';
import { env } from './env';

export const projectId: string = env.NEXT_PUBLIC_WALLET_CONNECT_ID;
if (!projectId) throw new Error('Project ID is not defined');

// import { type Chain } from 'viem';

// export const rootMainnet = {
//   id: 7668,
//   name: 'The Root Network',
//   nativeCurrency: { name: 'XRP', symbol: 'XRP', decimals: 18 },
//   rpcUrls: {
//     default: {
//       http: ['https://root.rootnet.live/'],
//       webSocket: ['wss://root.rootnet.live/ws'],
//     },
//   },
//   blockExplorers: {
//     default: { name: 'Rootscan', url: 'https://rootscan.io/' },
//   },
// } as const satisfies Chain;

// export const rootPorcini = {
//   id: 7672,
//   name: 'Porcini',
//   nativeCurrency: { name: 'XRP', symbol: 'XRP', decimals: 18 },
//   rpcUrls: {
//     default: {
//       http: ['https://porcini.rootnet.app/'],
//       webSocket: ['wss://porcini.rootnet.app/ws'],
//     },
//   },
//   blockExplorers: {
//     default: { name: 'Rootscan', url: 'https://porcini.rootscan.io/' },
//   },
// } as const satisfies Chain;

// const metadata = {
//   name: 'GetSendy',
//   description: 'GetSendy',
//   url: 'https://porcini.getsendy.xyz/', // origin must match your domain & subdomain
//   icons: ['https://porcini.getsendy.xyz/favicon.ico'],
// };

// export const config = createConfig({
//   chains: [mainnet, sepolia],
//   connectors: [
//     injected({ shimDisconnect: true, unstable_shimAsyncInject: true }),
//     walletConnect({ projectId }),
//     coinbaseWallet({
//       appName: 'Get Sendy',
//       appLogoUrl: '/logo.png',
//       chainId: mainnet.id,
//       darkMode: true,
//       enableMobileWalletLink: true,
//     }),
//   ],
//   ssr: true,
//   transports: {
//     [mainnet.id]: http(),
//     [sepolia.id]: http(),
//   },
// });

// const chains = [mainnet, sepolia, rootMainnet, rootPorcini] as const;
// export const web3Config = defaultWagmiConfig({
//   chains,
//   ssr: true,
//   projectId,
//   // enableEmail: true,
//   metadata,
//   storage: createStorage({
//     storage: cookieStorage,
//     key: 'web3modal',
//   }),
//   enableCoinbase: true,
//   enableWalletConnect: true,
//   enableInjected: true,

//   // ...config, // Optional - Override createConfig parameters
// });

// export const config = createConfig({
//   chains: [mainnet, rootMainnet, rootPorcini],
//   client({ chain }) {
//     return createClient({ chain, transport: http() });
//   },
// });
