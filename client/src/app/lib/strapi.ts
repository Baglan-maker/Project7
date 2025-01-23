import axios from "axios";
import { StrapiItem, ArticleAttributes, NewsAttributes, CategoryAttributes } from "../types/types";

const strapiApi = axios.create({
    baseURL: "https://diplomatic-prosperity-9c731615c5.strapiapp.com/api",
    headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${process.env.NEXT_PUBLIC_PROD_STRAPI_KEY}`
    },
});

// Функции для получения контента
export const fetchArticles = async (locale: string): Promise<{ data: StrapiItem<ArticleAttributes>[] }> => {
    const response = await strapiApi.get(`/articles?locale=${locale}&populate=category.localizations`);
    return response.data;
};

export const fetchNews = async (locale: string): Promise<{ data: StrapiItem<NewsAttributes>[] }> => {
    const response = await strapiApi.get(`/newss?locale=${locale}&populate=*`);
    return response.data;
};

export const fetchCategories = async (locale: string): Promise<{ data: StrapiItem<CategoryAttributes>[] }> => {
    const response = await strapiApi.get(`/categories?locale=${locale}&populate=*`);
    return response.data;
};

export default strapiApi;
