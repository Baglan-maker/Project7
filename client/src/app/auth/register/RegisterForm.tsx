"use client";

import React, { useState} from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, TextField, Typography, Alert, MenuItem, CircularProgress, InputAdornment, IconButton} from "@mui/material";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { getValidationSchema } from "@/app/lib/validation";
import api from "../../lib/axios";
import axios from "axios";
import { formStyles, typographyStyles, alertStyles, textFieldStyles,
    buttonStyles, loginTextStyles, loginButtonStyles } from '@/app/styles/form-styles';
import { dropDownCities } from "@/app/utils/cities"
import {useGoogleReCaptcha} from 'react-google-recaptcha-v3'
import {Visibility, VisibilityOff} from "@mui/icons-material";

const today = new Date();
const todayFormatted = today.toISOString().split("T")[0]; // Формат YYYY-MM-DD

type Inputs = {
    iin: string;
    email: string;
    fullName: string;
    birthDate: string;
    city: string;
    password: string;
};

type RegisterFormProps = {
    onLoginRedirect: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({onLoginRedirect,}) => {
    const { t } = useTranslation("register");
    const { executeRecaptcha } = useGoogleReCaptcha();
    const schema = getValidationSchema(t);
    const {
        register, handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            iin: "", email: "", fullName: "", birthDate: "",
            city: "", password: "",
        },
    });

    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<"info" | "success" | "error" | undefined>(
        undefined
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            if (isSubmitting) return;
            setIsSubmitting(true);

            if (!executeRecaptcha) {
                setAlertMessage(t("Ошибка: reCAPTCHA не доступна."));
                setAlertSeverity("error");
                return;
            }

            const recaptchaToken = await executeRecaptcha("register");
            await api.post("/register", { ...data, recaptchaToken });
            setAlertMessage(t("Регистрация успешна!"));
            setAlertSeverity("success");

            setTimeout(() => {
                setIsSubmitting(false);
                onLoginRedirect();
            }, 650);
        } catch (error) {
            setIsSubmitting(false);
            console.error("Ошибка регистрации", error);
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 400 && error.response.data.message === "IIN already taken") {
                    setAlertMessage(t("Этот ИИН уже занят. Пожалуйста, введите другой"));
                    setAlertSeverity("error");
                } else if (error.response.data.message === "Email already exists") {
                    setAlertMessage(t("Эта почта уже зарегистрирована"));
                    setAlertSeverity("error");
                } else {
                    setAlertMessage(t("Не удалось зарегистрировать пользователя. Попробуйте еще раз позже"));
                    setAlertSeverity("error");
                }
            }
            // @ts-ignore
            if (error.response?.status === 503) {
                setAlertMessage(t("Сеть недоступна. Проверьте подключение к интернету"));
                setAlertSeverity("error");
            }
        }
    };

    return (
        <main>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={formStyles}
            >
                <header>
                    <Typography
                        variant="h5"
                        sx={typographyStyles}
                    >
                        {t("Регистрация")}
                    </Typography>
                </header>

                {alertMessage && (
                    <Alert
                        severity={alertSeverity}
                        sx={alertStyles}
                    >
                        {alertMessage}
                    </Alert>
                )}

                <section>
                    <TextField
                        label={t("ИИН")}
                        fullWidth
                        {...register("iin")}
                        error={!!errors.iin}
                        helperText={errors.iin?.message}
                        sx={textFieldStyles}
                    />
                    <TextField
                        label={t("Почта")}
                        fullWidth
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        sx={textFieldStyles}
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
                        fullWidth
                        {...register("birthDate")}
                        error={!!errors.birthDate}
                        helperText={errors.birthDate?.message}
                        slotProps={{ inputLabel: { shrink: true }, input: { inputProps: {
                                min: "1930-01-01",
                                max: todayFormatted,
                            }, }, }}
                        sx={textFieldStyles}
                    />
                    <TextField
                        select
                        label={t("Город")}
                        fullWidth
                        {...register("city")}
                        error={!!errors.city}
                        helperText={errors.city?.message}
                        defaultValue=""
                        sx={textFieldStyles}
                        slotProps={{
                            select: {
                                MenuProps: {
                                    sx: {maxHeight: 48 * 6 + 8,},
                                }, },
                        }}
                    >
                        {dropDownCities.map((city) => (
                            <MenuItem key={city} value={city}>
                                {city}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label={t("Пароль")}
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        sx={textFieldStyles}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end" sx={{ mr: 0.3 }}>
                                    <IconButton
                                        onClick={togglePasswordVisibility}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff fontSize="inherit" /> : <Visibility fontSize="inherit" />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button type="submit" variant="contained" fullWidth sx={buttonStyles} disabled={isSubmitting}>
                        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : t("Регистрация")}
                    </Button>
                </section>

                <footer>
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
                </footer>
            </Box>
        </main>
    );
};

export default RegisterForm;

