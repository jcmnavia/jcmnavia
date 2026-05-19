import type {Metadata} from 'next';
import {
  Bricolage_Grotesque,
  Spectral,
  Hanken_Grotesk,
  Geist_Mono,
} from 'next/font/google';
import './globals.css';
import {ThemeProvider} from './lib/theme-provider';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});
const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['italic'],
  variable: '--font-spectral',
  display: 'swap',
});
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-hanken',
  display: 'swap',
});
const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Juan Camilo Marín Navia — Full Stack JS Engineer',
  description:
    'Full Stack JavaScript engineer with 7+ years building production web and mobile across React, Node, AWS and React Native.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={`${bricolage.variable} ${spectral.variable} ${hanken.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
