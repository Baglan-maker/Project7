'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { NewsItem } from '@/app/types/types';

type NewsCardProps = Pick<NewsItem, 'documentId' | 'title' | 'description' | 'cardImages'>;

const NewsCard: React.FC<NewsCardProps> = ({ documentId, title, description, cardImages }) => {
    const imageUrl = cardImages?.formats?.small?.url
        ? cardImages.formats.small.url
        : 'https://via.placeholder.com/150';
    return (
        <Link href={`/news/${documentId}`} passHref
                style={{
                    textDecoration: 'none',
                    color: 'inherit',
                }}
              >
                <Card sx={{maxWidth: 345, margin: {sm: 3}, cursor: 'pointer', marginBottom: {xs: 2}, borderRadius: '10px', width: {xs: '100%'}, overflow: 'hidden'}}>
                    {imageUrl && (
                        <CardMedia
                            component="img"
                            height="140"
                            image={imageUrl}
                            alt={title}
                        />
                    )}
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {title}
                        </Typography>
                        {description && (
                            <Typography variant="body2" color="text.secondary">
                                {description.substring(0, 100)}... {/* Обрезка текста */}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
        </Link>
);
};

export default NewsCard;
