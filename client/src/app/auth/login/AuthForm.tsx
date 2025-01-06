"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import api from "../../lib/axios";
import {
    loginFormStyles,
    loginTypographyStyles,
    loginAlertStyles,
    authLoginButtonStyles,
    registerTextStyles,
    registerButtonStyles,
} from 'src/app/styles';

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
    onRegisterRedirect: () => void;
    onDashboardRedirect: () => void;
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
            sx={loginFormStyles}
        >
            <Typography
                variant="h5"
                sx={loginTypographyStyles}
            >
                {t("Войти")}
            </Typography>

            {alertMessage && (
                <Alert
                    severity={alertSeverity}
                    sx={loginAlertStyles}
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
                sx={{ mt: 1.3 }}
            />

            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={authLoginButtonStyles}
            >
                {t("Войти")}
            </Button>

            <Box textAlign="center" mt={2}>
                <Typography
                    variant="body2"
                    sx={registerTextStyles}
                >
                    {t("Еще нет аккаунта?")}
                    <Button
                        variant="text"
                        size="small"
                        onClick={onRegisterRedirect}
                        sx={registerButtonStyles}
                    >
                        {t("Регистрация")}
                    </Button>
                </Typography>
            </Box>
        </Box>

    );
};

export default LoginForm;
