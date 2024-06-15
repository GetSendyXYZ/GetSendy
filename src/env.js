/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    // NEXTAUTH_SECRET:
    //   process.env.NODE_ENV === 'production'
    //     ? z.string()
    //     : z.string().optional(),
    // NEXTAUTH_URL: z.preprocess(
    //   // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    //   // Since NextAuth.js automatically uses the VERCEL_URL if present.
    //   str => process.env.VERCEL_URL ?? str,
    //   // VERCEL_URL doesn't include `https` so it cant be validated as a URL
    //   process.env.VERCEL ? z.string() : z.string().url()
    // ),
    // NEXT_AUTH_URL: z.string().url(),
    WALLET_WHITELIST: z.string().array().default([]),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url().default('http://localhost:3000'),
    NEXT_PUBLIC_WALLET_CONNECT_ID: z.string(),
    NEXT_PUBLIC_NETWORK: z.enum(['root', 'porcini']),
    NEXT_PUBLIC_BATCH_SIZE: z.number().default(500),
    NEXT_PUBLIC_FPASS: z.string(),
    NEXT_PUBLIC_SHOW_DEVTOOLS: z.boolean().default(false),
    NEXT_PUBLIC_TIP_TOKEN_ADDRESS: z
      .string()
      .default('0x4dFDCA75697A079a107b9F23DE6FCB766cDAa609'),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    // NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    // NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    // NEXT_AUTH_URL: process.env.NEXT_AUTH_URL,
    NEXT_PUBLIC_BASE_URL:
      process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
    NEXT_PUBLIC_WALLET_CONNECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID,
    NEXT_PUBLIC_SHOW_DEVTOOLS: process.env.NEXT_PUBLIC_SHOW_DEVTOOLS
      ? process.env.NEXT_PUBLIC_SHOW_DEVTOOLS === 'true'
      : false,
    NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK,
    NEXT_PUBLIC_BATCH_SIZE: process.env.NEXT_PUBLIC_BATCH_SIZE
      ? Number(process.env.NEXT_PUBLIC_BATCH_SIZE)
      : 500,
    WALLET_WHITELIST: process.env.WALLET_WHITELIST
      ? JSON.parse(process.env.WALLET_WHITELIST)
      : [],
    NEXT_PUBLIC_TIP_TOKEN_ADDRESS:
      process.env.NEXT_PUBLIC_TIP_TOKEN_ADDRESS ??
      '0xc7AC62Dd619B4f910Df8C6C56e08b2Cbe5129869',
    NEXT_PUBLIC_FPASS: process.env.NEXT_PUBLIC_FPASS,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
