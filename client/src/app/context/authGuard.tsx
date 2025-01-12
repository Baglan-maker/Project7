'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/axios';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SessionExpiredDialog from '@/app/components/modals/SessionExpiredDialog';

interface AuthGuardContextProps {
    isTokenValid: boolean;
    checkAuthorization: () => Promise<boolean>;
    handleLogout: () => void;
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthGuardContext = createContext<AuthGuardContextProps | null>(null);

export const AuthGuardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isTokenValid, setIsTokenValid] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    // Проверка токенов
    const checkAuthorization = async () => {
        try {
            await api.get('/check');
            setIsAuthorized(true);
            return true;
        } catch {
            setIsAuthorized(false);
            return false;
        }
    };

    // Проверка валидности токена каждые 10 секунд
    useEffect(() => {
        let interval: NodeJS.Timeout;

        const checkTokenValidity = async () => {
            try {
                await api.post('/refresh', {}, { withCredentials: true });
                setIsTokenValid(true);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401 || error.response?.status === 400) {
                        setIsTokenValid(false);
                        setShowModal(true);
                    }
                }
            }
        };

        if (isTokenValid) {
            interval = setInterval(checkTokenValidity, 10 * 1000); // Проверка каждые 10 секунд
        }

        return () => clearInterval(interval);
    }, [isTokenValid]);

    // Выход из системы
    const handleLogout = async () => {
        setShowModal(false);
        try {
            await api.post('/logout');
            router.push('/auth/login');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    // Автоматическая проверка авторизации при загрузке страницы
    useEffect(() => {
        (async () => {
            const isAuthorized = await checkAuthorization();
            if (!isAuthorized) {
                router.push('/auth/login');
            }
        })();
    }, [router]);

    if (!isAuthorized) {
        return null; // Показать загрузку или ничего
    }

    return (
        <AuthGuardContext.Provider value={{ isTokenValid, checkAuthorization, handleLogout, showModal, setShowModal }}>
            {children}
            <SessionExpiredDialog />
        </AuthGuardContext.Provider>
    );
};

export const useAuthGuard = () => {
    const context = useContext(AuthGuardContext);
    if (!context) {
        throw new Error('useAuthGuard must be used within an AuthGuardProvider');
    }
    return context;
};
