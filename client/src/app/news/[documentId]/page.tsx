'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Typography, Box } from '@mui/material';
import strapiApi from '@/app/lib/strapi';
import LoadingScreen from "@/app/components/common/LoadingScreen";

interface News {
    id: number;
    title: string;
    content?: string;
    imageUrl?: string | null;
}

const NewsPage = () => {
    const { documentId } = useParams(); // Получение ID из URL

    console.log("ID из URL:", documentId);
    const [newsItem, setNewsItem] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!documentId) return;

        console.log('ID из URL:', documentId);

        const fetchNews = async () => {
            setLoading(true);
            try {
                const currentLanguage = localStorage.getItem('locale') || 'en';

                const response = await strapiApi.get(
                    `/newss?filters[documentId][$eq]=${documentId}&filters[locale][$eq]=${currentLanguage}&populate=*`
                );
                console.log('Ответ Strapi:', response.data);

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
    }, [documentId]);

    if (loading) return <LoadingScreen />;

    if (!newsItem) {
        return (
            <Typography variant="h6" align="center" marginTop={3}>
                Новость не найдена
            </Typography>
        );
    }

    return (
        <Box sx={{ margin: '20px' }}>
            <Typography variant="h5">{newsItem.title}</Typography>

            {newsItem.imageUrl && (
                <Box sx={{ marginBottom: 2 }}>
                    <img
                        src={newsItem.imageUrl}
                        alt={newsItem.title}
                        style={{
                            display: 'block',
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: '10px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                    }}
                    />
                </Box>
            )}
            {newsItem.content && (
                <Typography variant="body1">
                    {newsItem.content}
                </Typography>
            )}
        </Box>
    );
};

export default NewsPage;
