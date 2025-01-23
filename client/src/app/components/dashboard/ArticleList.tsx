import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Article } from '@/app/types/types';
import Link from 'next/link';
import {useTranslation} from "react-i18next";

interface ArticleListProps {
    articles: Article[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
    const { i18n } = useTranslation();

    const getLocalizedCategoryName = (category: any) => {
        if (!category) return null;
        const currentLocale = i18n.language;
        const localizedCategory = category.localizations?.find((loc: any) => loc.locale === currentLocale);
        return localizedCategory?.name || category.name;
    };

    return (
        <Box>
            {articles.map((article) => (
                <Card key={article.id} sx={{ marginBottom: 2 }}>
                    <CardContent>
                        {/* Заголовок */}
                        <Link href={`/articles/${article.documentId}`} passHref>
                            <Typography variant="h6" sx={{ cursor: 'pointer', textDecoration: 'underline' }}>
                                {article.title}
                            </Typography>
                        </Link>

                        {/* Категория */}
                        {article.category && (
                            <Typography variant="body2" color="text.secondary">
                                {getLocalizedCategoryName(article.category)}
                            </Typography>
                        )}

                        {/* Контент */}
                        {article.description && (
                            <Typography variant="body1" sx={{ marginTop: 1 }}>
                                {article.description}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default ArticleList;
