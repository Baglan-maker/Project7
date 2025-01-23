'use client';

import { ToastContainer } from 'react-toastify';
import { toastConfig } from '../utils/toastConfig';
import { AuthGuardProvider, useAuthGuard } from '@/app/context/authGuard';
import {Box, Button, Typography, Container, Tabs, Tab} from '@mui/material';
import { useUsers } from '@/app/lib/useUsers';
import UserList from '@/app/components/dashboard/UserList';
import { useTranslation } from 'react-i18next';
import Navbar from '@/app/components/dashboard/Navbar';
import { buttonContainerStyles, buttonOutlinedStyles, containerStylesDash,
    userListStyles, welcomeTextStyles } from "@/app/styles/form-styles";
import {useState} from "react";
import LoadingScreen from "@/app/components/common/LoadingScreen";
import CategoryFilter from '../components/dashboard/CategoryFilter';
import ArticleList from "@/app/components/dashboard/ArticleList";
import NewsList from "@/app/components/dashboard/NewsList";
import LanguageSwitcherDash from "@/app/components/common/LanguageSwitcherDash";
import { useDashboardData } from "@/app/components/dashboard/useDashboardData";
import { useFilteredData } from "@/app/components/dashboard/useFilteredData";

const Dashboard = () => {
    return (
        <AuthGuardProvider>
            <Navbar />
            <DashboardContent />
        </AuthGuardProvider>
    );
};

const DashboardContent = () => {
    const { handleLogout } = useAuthGuard();
    const { users, fetchUsers } = useUsers();
    const { t } = useTranslation('dashboard');

    const [locale, setLocale] = useState<string>(localStorage.getItem('locale') || 'en');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);
    const { articles, news, categories, loading } = useDashboardData(locale);

    const { filteredArticles, filteredNews } = useFilteredData(
        articles,
        news,
        categories,
        selectedCategory,
        locale
    );

    if (loading) return <LoadingScreen />;

    return (
        <Container maxWidth={false} sx={containerStylesDash}>
            <ToastContainer {...toastConfig} />
            <Typography variant="h5" sx={welcomeTextStyles}>
                {t("welcome")}
            </Typography>

            <LanguageSwitcherDash
                onLanguageChange={(newLocale) => {
                    setLocale(newLocale);
                    localStorage.setItem('locale', newLocale);
                }}
            />

            {/* Категории */}
            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />

            {/* Табы */}
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} centered>
                <Tab label="Статьи" />
                <Tab label="Новости" />
            </Tabs>

            {/* Контент */}
            {activeTab === 0 && <ArticleList articles={filteredArticles} />}
            {activeTab === 1 && <NewsList news={filteredNews} />}

            <Box sx={buttonContainerStyles}>
                <Button variant="outlined" onClick={fetchUsers} sx={buttonOutlinedStyles}>
                    {t("showUsers")}
                </Button>
                <Button variant="outlined" onClick={handleLogout} sx={buttonOutlinedStyles}>
                    {t("logout")}
                </Button>
            </Box>

            <Box sx={userListStyles}>
                <UserList users={users} />
            </Box>
        </Container>
    );
};

export default Dashboard;
