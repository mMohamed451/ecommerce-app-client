'use client';

import { useEffect } from 'react';

interface LocaleHtmlAttributesProps {
  locale: string;
  direction: 'ltr' | 'rtl';
}

export function LocaleHtmlAttributes({ locale, direction }: LocaleHtmlAttributesProps) {
  useEffect(() => {
    // Update html lang and dir attributes based on locale
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  return null;
}
