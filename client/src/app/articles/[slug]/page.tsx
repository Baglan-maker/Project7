'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Typography, Box, Container } from '@mui/material';
import strapiApi from '@/app/lib/strapi';
import LoadingScreen from '@/app/components/common/LoadingScreen';
import Navbar from 'src/app/components/dashboard/Navbar';
import LanguageSwitcherDash from "@/app/components/common/LanguageSwitcherDash";
import { AuthGuardProvider } from '@/app/context/authGuard';
import SessionExpiredDialog from "@/app/components/modals/SessionExpiredDialog";

interface Article {
    id: number;
    title: string;
    category?: { name: string };
    content?: string;
    slug?: string;
    localizations?: { locale: string; slug: string }[]; // Локализации
}

const ArticlePage = () => {
    const { slug } = useParams(); // Получаем slug из URL
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [locale, setLocale] = useState<string>(localStorage.getItem('locale') || 'en');
    const [currentSlug, setCurrentSlug] = useState(slug); // Новый стейт для текущего slug
    const [localeLoaded, setLocaleLoaded] = useState(false); // Для отслеживания загрузки локали

    useEffect(() => {
        // Получаем локаль только на клиенте
        const storedLocale = localStorage.getItem('locale');
        if (storedLocale) {
            setLocale(storedLocale);
        } else {
            localStorage.setItem('locale', 'en');
            setLocale('en');
        }
        setLocaleLoaded(true);
    }, []);

    useEffect(() => {
        if (!currentSlug || !locale || !localeLoaded) return;

        const fetchArticle = async () => {
            setLoading(true);
            try {
                // Запрос к API для получения статьи по slug и локали
                const response = await strapiApi.get(
                    `/articles?filters[slug][$eq]=${currentSlug}&filters[locale][$eq]=${locale}&populate=*`
                );

                const fetchedArticle = response.data.data?.[0];
                if (fetchedArticle) {
                    setArticle({
                        id: fetchedArticle.id,
                        title: fetchedArticle.title,
                        category: fetchedArticle.category
                            ? { name: fetchedArticle.category.name }
                            : undefined,
                        content: fetchedArticle.content,
                        slug: fetchedArticle.slug,
                        localizations: fetchedArticle.localizations || [],
                    });
                } else {
                    setArticle(null);
                }
            } catch (error) {
                console.error('Ошибка загрузки статьи:', error);
                setArticle(null);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [currentSlug, locale, localeLoaded]);

    const handleLanguageChange = (newLocale: string) => {
        setLocale(newLocale);
        localStorage.setItem('locale', newLocale);

        // Найти соответствующий slug для новой локали
        if (article && article.localizations) {
            const localizedArticle = article.localizations.find(
                (localization) => localization.locale === newLocale
            );
            if (localizedArticle) {
                // Обновить currentSlug для правильного запроса к API
                setCurrentSlug(localizedArticle.slug);

                // Обновить URL в браузере
                window.history.replaceState(null, '', `/articles/${localizedArticle.slug}`);
            }
        }
    };

    if (loading) return <LoadingScreen />;

    if (!article) {
        return (
            <Typography variant="h6" align="center" marginTop={3}>
                Статья не найдена
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
                                    <Typography variant="h4">{article.title}</Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{marginBottom: '20px'}}
                                    >
                                        Категория: {article.category?.name || 'Без категории'}
                                    </Typography>
                                </header>
                                {article.content && (
                                    <section>
                                        <Typography variant="body1">
                                            {article.content}
                                        </Typography>
                                    </section>
                                )}
                            </Box>
                        </Container>
                    </article>
                    <SessionExpiredDialog/>
            </main>
        </AuthGuardProvider>
    );
};

export default ArticlePage;
