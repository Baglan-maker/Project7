"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import api from "../../lib/axios";

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

const getValidationSchema = (t: (key: string) => string) => {
    return z.object({
        iin: z
            .string()
            .regex(/^\d{12}$/, t("ИИН должен содержать 12 цифр"))
            .nonempty(t("ИИН обязателен")),
        fullName: z.string().nonempty(t("ФИО обязательно")),
        birthDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, t("Введите дату в формате ДД-ММ-ГГГГ"))
            .nonempty(t("Дата рождения обязательна")),
        city: z.string().nonempty(t("Город обязателен")),
        password: z
            .string()
            .min(6, t("Пароль должен содержать минимум 6 символов"))
            .nonempty(t("Пароль обязателен")),
    });
};

type Inputs = {
    iin: string;
    fullName: string;
    birthDate: string;
    city: string;
    password: string;
};

type RegisterFormProps = {
    onLoginRedirect: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
                                                       onLoginRedirect,
                                                   }) => {
    const { t } = useTranslation("register");
    const schema = getValidationSchema(t);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<"info" | "success" | "error" | undefined>(
        undefined
    );

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (!captchaToken) {
            setAlertMessage("Пожалуйста, пройдите CAPTCHA.");
            setAlertSeverity("error");
            return;
        }
        try {
            await api.post("/register", data);
            setAlertMessage("Регистрация успешна!");
            setAlertSeverity("success");
            setTimeout(() => {
                onLoginRedirect();
            }, 700);
        } catch (error) {
            console.error("Ошибка регистрации", error);
            setAlertMessage("Не удалось зарегистрировать пользователя.");
            setAlertSeverity("error");
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                maxWidth: { xs: 280, sm: 400 },
                mx: "auto",
                mt: { xs: 3, sm: 6 }, // Уменьшенный верхний отступ
                p: { xs: 2, sm: 4 },
                border: "1px solid #E0E0E0",
                borderRadius: 2,
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
            }}
        >
            <Typography
                variant="h5"
                textAlign="center"
                fontSize={{ xs: "1rem", sm: "1.5rem" }}
                sx={{
                        mb: {xs: 2, sm: 4 }
                    }}
            >
                {t("Регистрация")}
            </Typography>

            {alertMessage && (
                <Alert
                    severity={alertSeverity}
                    sx={{
                        mb: 1.5, // Уменьшенный нижний отступ для уведомлений
                        fontSize: { xs: "0.75rem", sm: "1rem" },
                    }}
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
                sx={{
                    mt: { xs: 0.8, sm: 1.5 }, // Уменьшенный отступ
                    "& .MuiInputBase-root": {
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                    "& .MuiFormHelperText-root": {
                        fontSize: "0.75rem",
                    },
                }}
            />
            <TextField
                label={t("ФИО")}
                fullWidth
                {...register("fullName")}
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                sx={{
                    mt: { xs: 0.8, sm: 1.5 },
                    "& .MuiInputBase-root": {
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                    "& .MuiFormHelperText-root": {
                        fontSize: "0.75rem",
                    },
                }}
            />
            <TextField
                label={t("Дата рождения")}
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                {...register("birthDate")}
                error={!!errors.birthDate}
                helperText={errors.birthDate?.message}
                sx={{
                    mt: { xs: 0.8, sm: 1.5 },
                    "& .MuiInputBase-root": {
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                    "& .MuiFormHelperText-root": {
                        fontSize: "0.75rem",
                    },
                }}
            />
            <TextField
                label={t("Город")}
                fullWidth
                {...register("city")}
                error={!!errors.city}
                helperText={errors.city?.message}
                sx={{
                    mt: { xs: 0.8, sm: 1.5 },
                    "& .MuiInputBase-root": {
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                    "& .MuiFormHelperText-root": {
                        fontSize: "0.75rem",
                    },
                }}
            />
            <TextField
                label={t("Пароль")}
                type="password"
                fullWidth
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{
                    mt: { xs: 0.8, sm: 1.5 },
                    "& .MuiInputBase-root": {
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                    },
                    "& .MuiFormHelperText-root": {
                        fontSize: "0.75rem",
                    },
                }}
            />

            <Box
                my={1}
                display="flex"
                justifyContent="center"
                sx={{
                    "& > div": {
                        width: { xs: "100%", sm: "auto" },
                        transform: { xs: "scale(0.85)", sm: "scale(1)" },
                        transformOrigin: "center",
                    },
                }}
            >
                <ReCAPTCHA
                    sitekey={recaptchaSiteKey}
                    onChange={(token) => setCaptchaToken(token)}
                />
            </Box>

            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                    mt: { xs: 0.8, sm: 2.5 },
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
            >
                {t("Регистрация")}
            </Button>

            <Box textAlign="center" mt={2}>
                <Typography
                    variant="body2"
                    fontSize={{ xs: "0.75rem", sm: "0.9rem" }}
                >
                    {t("Уже есть аккаунт?")}
                    <Button
                        variant="text"
                        size="small"
                        onClick={onLoginRedirect}
                        sx={{
                            fontSize: { xs: "0.75rem", sm: "0.9rem" },
                        }}
                    >
                        {t("Войти")}
                    </Button>
                </Typography>
            </Box>
        </Box>



    );
};

export default RegisterForm;

