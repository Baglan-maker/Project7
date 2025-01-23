import React from 'react';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { StrapiItem, CategoryAttributes } from '@/app/types/types';
import {categoryButtonStyles} from 'src/app/styles/form-styles'

interface CategoryFilterProps {
    categories: StrapiItem<CategoryAttributes>[];
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onCategoryChange }) => {
    const { t } = useTranslation('dashboard');

    return (
        <Box sx={{ display: 'flex', gap: 1.5, marginBottom: 2, justifyContent: 'center' }}>
            <Button
                sx={{...categoryButtonStyles}}
                variant={!selectedCategory ? 'contained' : 'outlined'}
                onClick={() => onCategoryChange(null)}
            >
                {t("Все")}
            </Button>
            {categories.map((category) => (
                <Button
                    key={category.id}
                    sx={{...categoryButtonStyles}}
                    variant={selectedCategory === category.name ? 'contained' : 'outlined'}
                    onClick={() => onCategoryChange(category.name || null )}
                >
                    {category.name}
                </Button>
            ))}
        </Box>
    );
};

export default CategoryFilter;
