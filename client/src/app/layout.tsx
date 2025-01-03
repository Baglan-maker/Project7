'use client';

import React from 'react';
import i18n from './src/../lib/i18n';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import theme from "./theme";

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
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