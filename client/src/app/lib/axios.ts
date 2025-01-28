import axios from "axios";

const api = axios.create({
    baseURL: '/api',
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

// Интерсептор запроса
api.interceptors.request.use(
    (config) => {
        if (!navigator.onLine) {
            // Выбрасываем ошибку, если сети нет
            return Promise.reject({
                response: {
                    status: 503,
                    data: { message: "Сеть недоступна. Проверьте подключение." },
                },
            });
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Интерсептор ответа
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.code === "ERR_NETWORK") {
            return Promise.reject({
                response: {
                    status: 503,
                    data: { message: "Сеть недоступна. Проверьте подключение." },
                },
            });
        }

        const originalRequest = error.config;

        if (originalRequest.url.includes('/refresh') && error.response?.status === 401) {

            await handleLogout();
            return Promise.reject(error);
        }

        // Если токен истек (401), пытаемся обновить его
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await api.post('/refresh', {}, { withCredentials: true });
                return api(originalRequest);
            } catch (err) {
                await handleLogout();
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
