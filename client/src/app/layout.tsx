'use client';

import React, {useEffect} from 'react';
import i18n from './src/../utils/i18n';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import theme from "./styles/theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Прочитать локаль из localStorage только на клиенте
        const currentLocale = localStorage.getItem('locale') || 'en';
        i18n.changeLanguage(currentLocale); // Меняем язык на клиенте
    }, []);
  return (
      <html lang="en">
      <body>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
            {children}
        </I18nextProvider>
      </ThemeProvider>
      </body>
      </html>
  );
}
