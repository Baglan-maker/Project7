import { useState } from 'react';
import api from '@/app/lib/axios';
import { toast } from 'react-toastify';
import axios from "axios";

export interface User {
    iin: string;
    full_name: string;
    city: string;
}

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);

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

    return { users, fetchUsers };
};
