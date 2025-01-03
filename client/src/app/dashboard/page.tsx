'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/axios';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { AuthGuardProvider, useAuthGuard } from 'src/app/dashboard/authGuard';

interface User {
    iin: string;
    full_name: string;
    city: string;
}

const Dashboard = () => {
    return (
        <AuthGuardProvider>
            <DashboardContent />
        </AuthGuardProvider>
    );
};

const DashboardContent = () => {
    const { showModal, handleLogout, setShowModal } = useAuthGuard();
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        (async () => {
            try {
                await api.get('/check');
                setAuthorized(true);
            } catch (error) {
                console.warn('Ошибка авторизации:', error);
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    router.push('/auth/login');
                }
            }
        })();
    }, [router]);

    useEffect(() => {
        if (showModal) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [showModal]);

    if (!authorized) {
        return null;
    }

    const handleContinue = () => {
        setShowModal(false);
        setOpen(false);
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get<User[]>('/users');
            setUsers(response.data);
            toast.success('Список пользователей загружен!', {
                position: window.innerWidth < 600 ? "top-center" : "bottom-right",
            });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 400) {
                toast.error('Токен истёк. Пожалуйста, авторизуйтесь снова.', {
                    position: window.innerWidth < 600 ? "top-center" : "bottom-right",
                });
            } else {
                toast.error('Не удалось загрузить список пользователей.', {
                    position: window.innerWidth < 600 ? "top-center" : "bottom-right",
                });
            }
        }
    };


    return (
        <div style={{ padding: '1rem', maxWidth: '900px', margin: '0 auto' }}>
            <ToastContainer
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                style={{ fontSize: window.innerWidth < 600 ? '0.875rem' : '1rem' }} // Адаптивный размер шрифта
            />
            <h1>Добро пожаловать в Dashboard</h1>
            <button onClick={handleLogout}>Выйти</button>
            <button onClick={fetchUsers}>Показать пользователей</button>
            <ul>
                {users.map((user) => (
                    <li key={user.iin}>
                        {user.full_name} — {user.city}
                    </li>
                ))}
            </ul>

            {/* Модальное окно MUI */}
            <Dialog open={open} onClose={handleContinue}>
                <DialogTitle>Срок действия сессии истёк</DialogTitle>
                <DialogContent>
                    <p>Продолжить или выйти?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogout} color="primary">Выйти</Button>
                    <Button onClick={handleContinue} color="secondary">Продолжить</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Dashboard;
