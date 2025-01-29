'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Box, Menu, MenuItem } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';

interface LanguageSwitcherDashProps {
    style?: React.CSSProperties;
    onLanguageChange: (language: string) => void;
}

const LanguageSwitcherDash: React.FC<LanguageSwitcherDashProps> = ({ style , onLanguageChange}) => {
    const { i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const switchLanguage = (language: string) => {
        i18n.changeLanguage(language);
        localStorage.setItem('locale', language);
        onLanguageChange(language);
        handleClose();  // Закрыть меню после выбора языка
    };

    return (
        <Box sx={{ position: 'fixed', top: { xs: 9, sm: 13 },  right: { xs: 15, sm: 30, md: 50, lg: 170 }, zIndex: 2, ...style }}>
            <Button
                variant="outlined"
                endIcon={<ArrowDropDown />}
                onClick={handleClick}
                sx={{
                    borderRadius: 20,
                    textTransform: 'none',
                    minWidth: 120,
                    padding: '8px 16px',
                    fontSize: { xs: '13px', sm: '14px' },
                    background: 'white',
                }}
            >
                {i18n.language === 'en' ? 'English (en)' : 'Русский (ru)'}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: 150,
                        textAlign: 'center',
                    },
                }}
            >
                <MenuItem onClick={() => switchLanguage('en')}>English (en)</MenuItem>
                <MenuItem onClick={() => switchLanguage('ru')}>Русский (ru)</MenuItem>
            </Menu>
        </Box>

    );
};

export default LanguageSwitcherDash;
