"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import api from "../../lib/axios";

const getValidationSchema = (t: (key: string) => string) =>
    z.object({
        iin: z
            .string()
            .regex(/^\d{12}$/, t("ИИН должен состоять из 12 цифр"))
            .nonempty(t("ИИН обязателен")),
        password: z.string().nonempty(t("Пароль обязателен")),
    });

type Inputs = {
    iin: string;
    password: string;
};

type LoginFormProps = {
    onRegisterRedirect: () => void; // Функция для перенаправления на регистрацию
    onDashboardRedirect: () => void; // Функция для перенаправления на дашборд
};

const LoginForm: React.FC<LoginFormProps> = ({
                                                 onRegisterRedirect,
                                                 onDashboardRedirect,
                                             }) => {
    const { t } = useTranslation("login");
    const schema = getValidationSchema(t);

    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<"error" | "success" | undefined>(undefined);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            await api.post('/login', data, { withCredentials: true });
            setAlertMessage(t("Вход выполнен успешно!"));
            setAlertSeverity("success");

            setTimeout(() => {
                onDashboardRedirect();
            }, 700);
        } catch (error) {
            console.error("Login failed", error);
            setAlertMessage(t("Неверный ИИН или пароль."));
            setAlertSeverity("error");
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                maxWidth: { xs: 320, sm: 400 }, // Ширина меняется для мобильных и больших экранов
                mx: "auto",
                mt: { xs: 4, sm: 8 }, // Меньший отступ сверху на мобильных
                p: { xs: 2, sm: 4 }, // Паддинги для мобильных и десктопа
                border: "1px solid #E0E0E0",
                borderRadius: 2,
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
            }}
        >
            <Typography
                variant="h5"
                textAlign="center"
                fontSize={{ xs: "1.25rem", sm: "1.5rem" }}
                sx={{
                    mb: { xs: 1.5, sm: 2.8 }
                }}
            >
                {t("Войти")}
            </Typography>

            {alertMessage && (
                <Alert
                    severity={alertSeverity}
                    sx={{ mb: 2, fontSize: { xs: "0.875rem", sm: "1rem" } }}
                >
                    {alertMessage}
                </Alert>
            )}

            <TextField
                label={t("ИИН")}
                fullWidth
                {...register("iin")}
                error={!!errors.iin}
                helperText={errors.iin?.message}
                sx={{ mt: 2 }}
            />
            <TextField
                label={t("Пароль")}
                type="password"
                fullWidth
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{ mt: 1.5 }}
            />

            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 1.5, py: { xs: 1, sm: 1.5 } }} // Высота кнопки меняется
            >
                {t("Войти")}
            </Button>

            <Box textAlign="center" mt={2}>
                <Typography
                    variant="body2"
                    fontSize={{ xs: "0.8rem", sm: "0.9rem" }}
                >
                    {t("Еще нет аккаунта?")}
                    <Button
                        variant="text"
                        size="small"
                        onClick={onRegisterRedirect}
                        sx={{
                            fontSize: { xs: "0.8rem", sm: "0.9rem" },
                        }}
                    >
                        {t("Регистрация")}
                    </Button>
                </Typography>
            </Box>
        </Box>

    );
};

export default LoginForm;
