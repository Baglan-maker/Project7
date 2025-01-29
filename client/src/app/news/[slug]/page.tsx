'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Typography, Box, Container } from '@mui/material';
import strapiApi from '@/app/lib/strapi';
import LoadingScreen from "@/app/components/common/LoadingScreen";
import Navbar from "@/app/components/dashboard/Navbar";
import LanguageSwitcherDash from "@/app/components/common/LanguageSwitcherDash";
import { AuthGuardProvider } from '@/app/context/authGuard';
import "src/app/styles/styles.css";
import SessionExpiredDialog from "@/app/components/modals/SessionExpiredDialog";

interface News {
    id: number;
    title: string;
    content?: string;
    imageUrl?: string | null;
    slug?: string;
    localizations?: { locale: string; slug: string }[]; // Локализации
}

const NewsPage = () => {
    const { slug } = useParams(); // Получение slug из URL
    const [newsItem, setNewsItem] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);
    const [locale, setLocale] = useState<string>('en');
    const [currentSlug, setCurrentSlug] = useState(slug);
    const [imageLoaded, setImageLoaded] = useState(false); // Отслеживание загрузки изображения
    const [localeLoaded, setLocaleLoaded] = useState(false); // Для отслеживания загрузки локали

    useEffect(() => {
        // Используем useEffect для получения локали только на клиенте
        const storedLocale = localStorage.getItem('locale');
        if (storedLocale) {
            setLocale(storedLocale);  // Обновляем локаль на клиенте
        } else {
            localStorage.setItem('locale', 'en');
            setLocale('en');
        }
        setLocaleLoaded(true); // Устанавливаем флаг после загрузки локали
    }, []);

    useEffect(() => {
        if (!currentSlug || !locale || !localeLoaded) return;

        const fetchNews = async () => {
            setLoading(true);
            try {
                if (!currentSlug || !locale) return;

                const response = await strapiApi.get(
                    `/newss?filters[slug][$eq]=${currentSlug}&filters[locale][$eq]=${locale}&populate=*`
                );

                const fetchedNews = response.data.data?.[0];
                if (fetchedNews) {
                    const imageUrl = fetchedNews.cardImages?.formats?.small?.url
                        ? fetchedNews.cardImages.formats.small.url
                        : null;

                    setNewsItem({
                        id: fetchedNews.id,
                        title: fetchedNews.title,
                        content: fetchedNews.content,
                        imageUrl,
                        slug: fetchedNews.slug,
                        localizations: fetchedNews.localizations || [],
                    });
                } else {
                    setNewsItem(null);
                }
            } catch (error) {
                console.error('Ошибка загрузки новости:', error);
                setNewsItem(null);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [currentSlug, locale, localeLoaded]);

    const handleLanguageChange = (newLocale: string) => {
        setLocale(newLocale);
        localStorage.setItem('locale', newLocale);

        // Найти соответствующий slug для новой локали
        if (newsItem && newsItem.localizations) {
            const localizedNews = newsItem.localizations.find(
                (localization) => localization.locale === newLocale
            );
            if (localizedNews) {
                // Обновить currentSlug для правильного запроса к API
                setCurrentSlug(localizedNews.slug);

                // Обновить URL в браузере
                window.history.replaceState(null, '', `/news/${localizedNews.slug}`);
            }
        }
    };

    if (loading) return <LoadingScreen />;

    if (!newsItem) {
        return (
            <Typography variant="h6" align="center" marginTop={3}>
                Новость не найдена
            </Typography>
        );
    }

    return (
        <AuthGuardProvider>
            <main>
                <header>
                    <Navbar/>
                    <LanguageSwitcherDash onLanguageChange={handleLanguageChange}/>
                </header>
                <article>
                    <Container sx={{marginTop: '80px'}}>
                        <Box sx={{margin: '20px'}}>
                            <header>
                                <Typography variant="h5">{newsItem.title}</Typography>
                            </header>
                            {newsItem.imageUrl && (
                                <Box
                                    sx={{
                                        marginBottom: 2,
                                        position: 'relative',
                                        textAlign: 'center',
                                    }}
                                >
                                    {!imageLoaded && (
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: '200px',
                                                backgroundColor: '#e0e0e0',
                                                borderRadius: '10px',
                                                animation: 'pulse 1.5s infinite',
                                            }}
                                        />
                                    )}
                                    <img
                                        src={newsItem.imageUrl}
                                        alt={newsItem.title}
                                        style={{
                                            display: imageLoaded ? 'block' : 'none',
                                            maxWidth: '100%',
                                            height: 'auto',
                                            borderRadius: '10px',
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                        }}
                                        onLoad={() => setImageLoaded(true)}
                                    />
                                </Box>
                            )}
                            {newsItem.content && (
                                <section>
                                    <Typography variant="body1">
                                        {newsItem.content}
                                    </Typography>
                                </section>
                            )}
                        </Box>
                    </Container>
                </article>
            <SessionExpiredDialog />
            </main>
        </AuthGuardProvider>
    );
};

export default NewsPage;