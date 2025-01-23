'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Typography, Box } from '@mui/material';
import strapiApi from '@/app/lib/strapi';
import LoadingScreen from "@/app/components/common/LoadingScreen";

interface Article {
    id: number;
    title: string;
    category?: { name: string };
    content?: string;
}

const ArticlePage = () => {
    const { documentId } = useParams(); // Получение ID из URL

    console.log("ID из URL:", documentId)
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!documentId) return;

        console.log('ID из URL:', documentId);

        const fetchArticle = async () => {
            setLoading(true);
            try {
                const currentLanguage = localStorage.getItem('locale') || 'en';

                const response = await strapiApi.get(
                    `/articles?filters[documentId][$eq]=${documentId}&filters[locale][$eq]=${currentLanguage}&populate=*`
                );
                console.log('Ответ Strapi:', response.data);

                const fetchedArticle = response.data.data?.[0]; // Если это массив, возьмем первый элемент
                if (fetchedArticle) {
                    setArticle({
                        id: fetchedArticle.id,
                        title: fetchedArticle.title,
                        category: fetchedArticle.category
                            ? { name: fetchedArticle.category.name }
                            : undefined,
                        content: fetchedArticle.content,
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
    }, [documentId]);

    if (loading) return <LoadingScreen />;

    if (!article) {
        return (
            <Typography variant="h6" align="center" marginTop={3}>
                Статья не найдена
            </Typography>
        );
    }

    return (
        <Box sx={{ margin: '20px' }}>
            <Typography variant="h4">{article.title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '20px' }}>
                Категория: {article.category?.name || 'Без категории'}
            </Typography>
            {article.content && (
                <Typography variant="body1">
                    {article.content}
                </Typography>
            )}
        </Box>
    );
};

export default ArticlePage;
