import NextAuthProvider from '@/components/providers/next-auth-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

import './globals.css';
import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const beaufortfor_lol = localFont({
  src: [
    {
      path: './fonts/BeaufortforLOL/BeaufortforLOL-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/BeaufortforLOL/BeaufortforLOL-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: './fonts/BeaufortforLOL/BeaufortforLOL-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/BeaufortforLOL/BeaufortforLOL-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/BeaufortforLOL/BeaufortforLOL-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/BeaufortforLOL/BeaufortforLOL-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './fonts/BeaufortforLOL/BeaufortforLOL-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/BeaufortforLOL/BeaufortforLOL-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: './fonts/BeaufortforLOL/BeaufortforLOL-Heavy.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: './fonts/BeaufortforLOL/BeaufortforLOL-HeavyItalic.ttf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-beaufortfor-lol',
});

export const metadata: Metadata = {
  title: 'Riftmaker',
  description: 'LoL tournaments made easy',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(
          'bg-background font-sans antialiased min-h-screen flex items-center flex-col',
          inter.variable,
          beaufortfor_lol.variable,
          beaufortfor_lol.className,
        )}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <NextAuthProvider>
            <Header />
            {children}
            <Footer />
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
