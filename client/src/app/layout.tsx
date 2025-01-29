'use client';

import React, { useEffect } from 'react';
import i18n from './src/../utils/i18n';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import theme from "./styles/theme";
import "./styles/styles.css"
import { usePathname } from 'next/navigation';

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
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
                {pathname === '/auth/register' ? (
                    <GoogleReCaptchaProvider
                        reCaptchaKey={siteKey}
                        scriptProps={{
                            async: true,
                            defer: true,
                            appendTo: "body",
                        }}
                    >
                        {children}
                    </GoogleReCaptchaProvider>
                ) : (
                    children
                )}
            </I18nextProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
