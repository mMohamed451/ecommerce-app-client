import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Providers } from '../providers';
import { LocaleHtmlAttributes } from './locale-html-attributes';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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
      <div className={inter.variable}>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </div>
    </>
  );
}
