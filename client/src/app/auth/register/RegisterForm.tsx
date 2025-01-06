"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import api from "../../lib/axios";
import axios from "axios";
import { formStyles,
    typographyStyles,
    alertStyles,
    textFieldStyles,
    captchaBoxStyles,
    buttonStyles,
    loginTextStyles,
    loginButtonStyles } from 'src/app/styles';

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
            setAlertMessage(t("Пожалуйста, пройдите CAPTCHA"));
            setAlertSeverity("error");
            return;
        }
        try {
            await api.post("/register", data);
            setAlertMessage(t("Регистрация успешна!"));
            setAlertSeverity("success");
            setTimeout(() => {
                onLoginRedirect();
            }, 700);
        } catch (error) {
            console.error("Ошибка регистрации", error);
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 400 && error.response.data.message === "IIN already taken") {
                    setAlertMessage(t("Этот ИИН уже занят. Пожалуйста, введите другой"));
                    setAlertSeverity("error");
                } else {
                    setAlertMessage(t("Не удалось зарегистрировать пользователя. Попробуйте еще раз позже"));
                    setAlertSeverity("error");
                }
            }
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={formStyles}
        >
            <Typography
                variant="h5"
                sx={typographyStyles}
            >
                {t("Регистрация")}
            </Typography>

            {alertMessage && (
                <Alert
                    severity={alertSeverity}
                    sx={alertStyles}
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
                    mt: { xs: 0.6, sm: 1.5 }, // Уменьшенный отступ
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
                sx={textFieldStyles}
            />
            <TextField
                label={t("Дата рождения")}
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                {...register("birthDate")}
                error={!!errors.birthDate}
                helperText={errors.birthDate?.message}
                sx={textFieldStyles}
            />
            <TextField
                label={t("Город")}
                fullWidth
                {...register("city")}
                error={!!errors.city}
                helperText={errors.city?.message}
                sx={textFieldStyles}
            />
            <TextField
                label={t("Пароль")}
                type="password"
                fullWidth
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={textFieldStyles}
            />

            <Box sx={captchaBoxStyles}>
                <ReCAPTCHA
                    sitekey={recaptchaSiteKey}
                    onChange={(token) => setCaptchaToken(token)}
                />
            </Box>

            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={buttonStyles}
            >
                {t("Регистрация")}
            </Button>

            <Box textAlign="center" mt={2}>
                <Typography
                    variant="body2"
                    sx={loginTextStyles}
                >
                    {t("Уже есть аккаунт?")}
                    <Button
                        variant="text"
                        size="small"
                        onClick={onLoginRedirect}
                        sx={loginButtonStyles}>
                        {t("Войти")}
                    </Button>
                </Typography>
            </Box>
        </Box>



    );
};

export default RegisterForm;

