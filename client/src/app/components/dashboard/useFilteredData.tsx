import { useMemo } from "react";
import { StrapiItem, ArticleAttributes, NewsAttributes, CategoryAttributes } from "@/app/types/types";

export const useFilteredData = (
    articles: StrapiItem<ArticleAttributes>[],
    news: StrapiItem<NewsAttributes>[],
    categories: StrapiItem<CategoryAttributes>[],
    selectedCategory: string | null,
    locale: string
) => {
    // Функция для получения локализованного имени категории
    const getLocalizedCategoryName = (category: any, locale: string) => {
        if (!category) return null;
        const localizedCategory = category.localizations?.find((loc: any) => loc.locale === locale);
        return localizedCategory?.name || category.name;
    };

    // Мемоизация фильтрованных данных
    const filteredArticles = useMemo(() => {
        if (!selectedCategory) return articles;
        return articles.filter(
            (article) => getLocalizedCategoryName(article.category, locale) === selectedCategory
        );
    }, [articles, selectedCategory, locale]);

    const filteredNews = useMemo(() => {
        if (!selectedCategory) return news;
        return news.filter(
            (newsItem) => newsItem.category?.name === selectedCategory
        );
    }, [news, selectedCategory]);

    return { filteredArticles, filteredNews };
};
