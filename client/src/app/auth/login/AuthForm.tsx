"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {Box, Button, TextField, Typography, Alert, IconButton, InputAdornment, CircularProgress} from "@mui/material";
import { z } from "zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import api from "../../lib/axios";
import { loginFormStyles, loginTypographyStyles, loginAlertStyles, authLoginButtonStyles,
    registerTextStyles, registerButtonStyles, } from '@/app/styles/form-styles';
import Link from "next/link";
import axios from "axios";

const getValidationSchema = (t: (key: string) => string) =>
    z.object({
        iin: z
            .string()
            .regex(/^\d{12}$/, t("ИИН должен состоять из 12 цифр"))
            .nonempty(t("ИИН обязателен")),
        password: z
            .string()
            .min(8, t("Пароль должен содержать минимум 8 символов"))
            .regex(/[A-Z]/, t("Пароль должен содержать хотя бы одну заглавную букву"))
            .regex(/\d/, t("Пароль должен содержать хотя бы одну цифру"))
            .nonempty(t("Пароль обязателен"))
            .refine(
                (password) => !password.includes(" "),
                { message: t("Пароль не должен содержать пробелов") }
            )
            .refine(
                (password) => !/[а-яА-ЯёЁ]/.test(password),
                { message: t("Пароль не должен содержать кириллицу") }
            )
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
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            await api.post('/login', data, { withCredentials: true });
            setAlertMessage(t("Вход выполнен успешно!"));
            setAlertSeverity("success");
            setTimeout(() => {
                onDashboardRedirect();
            }, 600);
        } catch (error) {
            console.error("Login failed", error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 503) {
                    setAlertMessage(t("Сеть недоступна. Проверьте подключение к интернету."));
                } else if (error.response?.status === 400) {
                    setAlertMessage(t("Неверный ИИН или пароль."));
                } else {
                    setAlertMessage(t("Произошла непредвиденная ошибка."));
                }
            } else {
                setAlertMessage(t("Произошла ошибка. Проверьте подключение."));
            }

            setAlertMessage(t("Неверный ИИН или пароль.1"));
            setAlertSeverity("error");
            setIsSubmitting(false);
        }
    };

    return (
        <main>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={loginFormStyles}
            >
                <header>
                    <Typography
                        variant="h5"
                        sx={loginTypographyStyles}
                    >
                        {t("Войти")}
                    </Typography>
                </header>

                <section>
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
                        sx={{mt: 2}}
                    />
                    <TextField
                        label={t("Пароль")}
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        sx={{mt: 1.3}}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end" sx={{mr: 1}}>
                                    <IconButton
                                        onClick={togglePasswordVisibility}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff fontSize="inherit"/> :
                                            <Visibility fontSize="inherit"/>}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box sx={{maxWidth: 400, ml: {sm: 34, xs: 23}, mt: -2, textAlign: "center"}}>
                        <Typography variant="body2" sx={{mt: 2}}>
                            <Link href="/auth/forgot-password">Забыли пароль?</Link>
                        </Typography>
                    </Box>

                    <Button type="submit" variant="contained" fullWidth sx={authLoginButtonStyles}
                            disabled={isSubmitting}>
                        {isSubmitting ? <CircularProgress size={24} color="inherit"/> : t("Войти")}
                    </Button>
                </section>
                <footer>
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
                </footer>
            </Box>
        </main>
    );
};

export default LoginForm;
