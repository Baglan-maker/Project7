import { useState, useEffect } from "react";
import { fetchArticles, fetchNews, fetchCategories } from "src/app/lib/strapi";
import { StrapiItem, ArticleAttributes, NewsAttributes, CategoryAttributes } from "src/app/types/types";

export const useDashboardData = (locale: string) => {
    const [articles, setArticles] = useState<StrapiItem<ArticleAttributes>[]>([]);
    const [news, setNews] = useState<StrapiItem<NewsAttributes>[]>([]);
    const [categories, setCategories] = useState<StrapiItem<CategoryAttributes>[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [articlesData, newsData, categoriesData] = await Promise.all([
                    fetchArticles(locale),
                    fetchNews(locale),
                    fetchCategories(locale),
                ]);
                setArticles(articlesData.data);
                setNews(newsData.data);
                setCategories(categoriesData.data);
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [locale]);

    return { articles, news, categories, loading };
};
