'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/axios';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface AuthGuardContextProps {
    isTokenValid: boolean;
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleLogout: () => void;
}

const AuthGuardContext = createContext<AuthGuardContextProps | null>(null);

export const AuthGuardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isTokenValid, setIsTokenValid] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const checkTokenValidity = async () => {
            try {
                await api.post('/refresh');
                setIsTokenValid(true);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    // Если ошибка с кодом 401 или 400, показываем модальное окно
                    if (error.response?.status === 401 || error.response?.status === 400) {
                        setIsTokenValid(false);
                        setShowModal(true); // Показываем модальное окно при невалидном токене
                    } else {
                        console.error('Ошибка при проверке токена:', error);
                    }
                } else {
                    console.error('Ошибка при проверке токена:', error);
                }
            }
        };

        if (isTokenValid) {
            interval = setInterval(checkTokenValidity, 10 * 1000); // Проверка каждые 10 секунд
        }

        return () => {
            clearInterval(interval);
        };
    }, [isTokenValid]);

    const handleLogout = async () => {
        setShowModal(false);
        try {
            await api.post('/logout');
            router.push('/auth/login');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    return (
        <AuthGuardContext.Provider value={{ isTokenValid, showModal, setShowModal, handleLogout }}>
            {children}
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
