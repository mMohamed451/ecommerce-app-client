import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, Cairo } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Providers } from '../providers';
import { LocaleHtmlAttributes } from './locale-html-attributes';

// Primary body font - Inter (clean, readable, professional)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
});

// Display font for headings - Plus Jakarta Sans (modern, friendly, bold)
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  preload: true,
});

// Arabic font - Cairo (excellent Arabic support)
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  preload: false, // Only load when needed
});

export const metadata: Metadata = {
  title: 'Marketplace - Multi-Vendor E-Commerce Platform',
  description: 'A modern multi-vendor marketplace platform',
  keywords: ['marketplace', 'e-commerce', 'multi-vendor', 'online shopping'],
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <>
      <LocaleHtmlAttributes locale={locale} direction={direction} />
      <div className={`${inter.variable} ${plusJakartaSans.variable} ${locale === 'ar' ? cairo.variable : ''}`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </div>
    </>
  );
}
