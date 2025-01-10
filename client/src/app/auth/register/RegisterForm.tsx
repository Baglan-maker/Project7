"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, TextField, Typography, Alert, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { getValidationSchema } from "@/app/lib/validation";
import ReCAPTCHA from "react-google-recaptcha";
import api from "../../lib/axios";
import axios from "axios";
import { formStyles, typographyStyles, alertStyles, textFieldStyles, captchaBoxStyles,
    buttonStyles, loginTextStyles, loginButtonStyles } from 'src/app/styles';
import { dropDownCities } from "src/app/lib/cities"

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;
const today = new Date();
const todayFormatted = today.toISOString().split("T")[0]; // Формат YYYY-MM-DD

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

const RegisterForm: React.FC<RegisterFormProps> = ({onLoginRedirect,}) => {
    const { t } = useTranslation("register");
    const schema = getValidationSchema(t);
    const {
        register, handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            iin: "", fullName: "", birthDate: "",
            city: "", password: "",
        },
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

            <Button type="submit"
                variant="contained" fullWidth
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

