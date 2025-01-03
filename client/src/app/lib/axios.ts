import axios from "axios";

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? 'https://project7-m15f.onrender.com' : 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true, // Автоматическая отправка cookies
});

const handleLogout = async () => {
        try {
            await api.post('/logout', {}, {withCredentials: true});
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
};

// Интерсептор ответа
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url.includes('/refresh') && error.response?.status === 401) {

            // Удаляем куки
            await handleLogout();
            return Promise.reject(error);
        }

        // Если токен истек (401), пытаемся обновить его
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Запрос на обновление токена
                await api.post('/refresh');

                // Повторяем оригинальный запрос
                return api(originalRequest);
            } catch (err) {
                // Удаляем cookies
                await handleLogout();

                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
