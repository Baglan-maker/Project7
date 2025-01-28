'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import {Box, Card, CardContent, CardMedia, Typography} from '@mui/material';
import { NewsItem } from '@/app/types/types';

type NewsCardProps = Pick<NewsItem, 'slug' | 'title' | 'description' | 'cardImages'>;

const NewsCard: React.FC<NewsCardProps> = ({ slug, title, description, cardImages }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const strapiBaseUrl = 'https://diplomatic-prosperity-9c731615c5.strapiapp.com';
    const imageUrl = cardImages?.formats?.small?.url
        ? `${strapiBaseUrl}${cardImages.formats.small.url}`
        : 'https://via.placeholder.com/150';
    return (
        <Link href={`/news/${slug}`} passHref
                style={{
                    textDecoration: 'none',
                    color: 'inherit',
                }}
              >
                <Card sx={{maxWidth: 345, margin: {sm: 3}, cursor: 'pointer', marginBottom: {xs: 2}, borderRadius: '10px', width: {xs: '100%'}, overflow: 'hidden'}}>
                    <Box sx={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
                        {!imageLoaded && (
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: '#e0e0e0',
                                    animation: 'pulse 1.5s infinite',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                }}
                            />
                        )}
                        <CardMedia
                            component="img"
                            height="140"
                            image={imageUrl}
                            alt={title}
                            style={{ display: imageLoaded ? 'block' : 'none' }}
                            onLoad={() => setImageLoaded(true)} // Устанавливаем состояние после загрузки
                        />
                    </Box>
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
