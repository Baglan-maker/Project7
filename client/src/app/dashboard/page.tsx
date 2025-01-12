'use client';

import { ToastContainer } from 'react-toastify';
import { toastConfig } from '../utils/toastConfig';
import { AuthGuardProvider, useAuthGuard } from '@/app/context/authGuard';
import { Box, Button, Typography, Container } from '@mui/material';
import { useUsers } from '@/app/lib/useUsers';
import UserList from '@/app/components/dashboard/UserList';
import { useTranslation } from 'react-i18next';
import Navbar from '@/app/components/dashboard/Navbar';
import { buttonContainerStyles, buttonOutlinedStyles, containerStylesDash,
    userListStyles, welcomeTextStyles } from "@/app/styles/form-styles";

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

    return (
        <Container maxWidth={false} sx={containerStylesDash}>
            <ToastContainer {...toastConfig} />
            <Typography variant="h5" sx={welcomeTextStyles}>
                {t("welcome")}
            </Typography>

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
