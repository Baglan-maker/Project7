export interface StrapiAttributes {
    title?: string;
    name?: string;
    cardImages?: { url: string }[];
}

export interface Article {
    id: number;
    title: string;
    category?: { name: string };
    content?: string
    documentId: string;
    description?: string;
}

export interface StrapiItem<T = StrapiAttributes> {
    id: number;
    title: string;
    content?: string;
    name?: string;
    category?: CategoryAttributes;
    attributes?: T;
    documentId: string;
    description?: string;
    cardImages?: {
        formats?: {
            small?: { url: string };
            medium?: { url: string };
            thumbnail?: { url: string };
        };
    };
}

export interface ArticleAttributes extends StrapiAttributes {
    title: string;
    content?: string;
    category: CategoryAttributes;
}

export interface NewsAttributes extends StrapiAttributes {
    title: string;
    content: string;
    description?: string;
}

export interface CategoryAttributes extends StrapiAttributes {
    name: string;
}

export interface ImageFormats {
    small?: { url: string };
    medium?: { url: string };
    thumbnail?: { url: string };
}

export interface CardImages {
    formats?: ImageFormats;
}

export interface NewsItem {
    documentId: string;
    title: string;
    content?: string;
    description?: string;
    cardImages?: CardImages;
}

export interface NewsListProps {
    news: NewsItem[];
}