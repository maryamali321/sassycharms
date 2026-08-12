import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import '@/styles/main.css';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif-google',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans-google',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SaasyCharms – Jewellery',
    template: '%s – SaasyCharms',
  },
  description:
    'Delicate, handcrafted jewellery made for the modern woman who loves all things pink & pretty.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorantGaramond.variable} ${jost.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
