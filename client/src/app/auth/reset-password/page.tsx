"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {CircularProgress, Alert, TextField, Button, Box, Typography, InputAdornment, IconButton} from "@mui/material";
import api from "src/app/lib/axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LanguageSwitcher from "@/app/components/common/LanguageSwitcher";

const getValidationSchema = (t: (key: string) => string) =>
    z.object({
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
            ),
        confirmPassword: z
            .string(),
    }).superRefine(({ password, confirmPassword }, ctx) => {
        if (password !== confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: t("Пароли должны совпадать"),
                path: ["confirmPassword"],
            });
        }
    });

type Inputs = {
    password: string;
    confirmPassword: string;
};

const ResetPasswordContent = ({ token }: { token: string }) => {
    const { t } = useTranslation("login");
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState<"error" | "info" | "success" | "warning">("info");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const schema = getValidationSchema(t);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<Inputs> = async ({ password }) => {
        setAlertMessage("");
        setLoading(true);

        try {
            await api.post("/reset-password", { token, newPassword: password });
            setAlertMessage(t("Пароль успешно сброшен"));
            setAlertSeverity("success");
            setTimeout(() => router.push("/auth/login"), 1700);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 400 && error.response.data.message === "Токен недействителен или истек.") {
                    setAlertMessage(t("Токен недействителен или истек"));
                    setAlertSeverity("error");
                }
            } else {
                console.error(error);
                setAlertMessage(t("Ошибка при сбросе пароля"));
                setAlertSeverity("error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100vh"
                px={2}
            >

                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{width: "100%", maxWidth: 400}}
                >
                    <header>
                        <Typography variant="h5" textAlign="center" mb={3}>
                            {t("Установитe новый пароль")}
                        </Typography>
                    </header>
                    {alertMessage && (
                        <Alert severity={alertSeverity} sx={{mb: 2}}>
                            {alertMessage}
                        </Alert>
                    )}

                    <section>
                        <TextField
                            label={t("Введите новый пароль")}
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            {...register("password")}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            sx={{mb: 3}}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" sx={{mr: 1}}>
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            label={t("Подтвердите новый пароль")}
                            type={showConfirmPassword ? "text" : "password"}
                            fullWidth
                            {...register("confirmPassword")}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            sx={{mb: 3}}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" sx={{mr: 1}}>
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{mb: 2}}
                        >
                            {loading ? <CircularProgress size={24}/> : t("Установить пароль")}
                        </Button>
                    </section>
                </Box>
                <section>
                    <LanguageSwitcher/>
                </section>
            </Box>
        </main>
);
};

export default ResetPasswordContent;
