import '@/styles/globals.css';

import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import { ThemeProvider } from '@/theme-provider';
import Footer from '@/components/Footer';
import { env } from '@/env';
import Header from '@/components/Header';
import { AppProviders } from '@/Providers';
import { Toaster } from 'sonner';
import { Loader } from '@/components/Loader';

export const metadata = {
  title: 'Get Sendy',
  description: 'Bulk Transfer on The Root Network',
  creator: 'Richie Rich',
  publisher: 'Richie Rich',
  openGraph: {
    title: 'Get Sendy',
    description: 'Bulk Transfer on The Root Network',
    url: env.NEXT_PUBLIC_BASE_URL,
    siteName: 'Get Sendy',
    images: [
      {
        url: `${env.NEXT_PUBLIC_BASE_URL}/facebook.png`,
        width: 1200,
        height: 628,
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  manifest: `${env.NEXT_PUBLIC_BASE_URL}/site.webmanifest`,
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Sendy',
    description: 'Bulk Transfer on The Root Network',
    creator: '@qtrichierich',
    creatorId: '190161291',
    images: [`${env.NEXT_PUBLIC_BASE_URL}/twitter.png`], // Must be an absolute URL
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/apple-touch-icon.png',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon.png',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} `}
      >
        <Loader classes="h-[100vh] w-full absolute top-0 left-0">
          <Loader.Logo />
          <Loader.AnimatedText text="Loading" />
        </Loader>
        <AppProviders>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            // disableTransitionOnChange
          >
            <div className="font-geistSans w-full mx-auto p-0 min-h-[calc(100vh-90px)] lg:min-h-[calc(100vh-45px)]  relative z-20 mb-[90px] lg:mb-[45px] bg-background">
              <Header />
              <>{children}</>
            </div>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </AppProviders>
      </body>
    </html>
  );
}
