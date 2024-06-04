import { env } from '@/env';

export async function GET() {
  const wallets = env.WALLET_WHITELIST;
  return Response.json(wallets);
}
