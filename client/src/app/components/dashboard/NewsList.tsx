import React from 'react';
import NewsCard from './NewsCard';
import { Box } from '@mui/material';
import { NewsListProps } from '@/app/types/types';

const NewsList: React.FC<NewsListProps> = ({ news }) => {
    return (
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
            marginTop={{sm: -5, xs: 0.5}}
            marginBottom={{sm: -5, xs: 2}}
            p={{sm: 5, xs: 1}}
        >
            {news.map((item) => (
                <Box
                    key={item.documentId}
                    maxWidth='400'
                    display="flex"
                >
                    <Box
                        width="100%" // Установка ширины внутри Box
                        display="flex"
                        marginTop={{sm: -0.9}}
                        flexDirection="column"
                        justifyContent="space-between"
                        height="100%"
                    >
                        <NewsCard
                            {...item}
                        />
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default NewsList;
