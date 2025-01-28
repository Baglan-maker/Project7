"use client";
import React, { useState } from "react";
import { CircularProgress, Alert, TextField, Button, Box, Typography } from "@mui/material";
import api from "src/app/lib/axios";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import LanguageSwitcher from "@/app/components/common/LanguageSwitcher";

const getValidationSchema = (t: (key: string) => string) =>
    z.object({
        iin: z
            .string()
            .regex(/^\d{12}$/, t("ИИН должен состоять из 12 цифр"))
            .nonempty(t("ИИН обязателен")),
    });

type Inputs = {
    iin: string;
};

const ForgotPassword = () => {
    const { t } = useTranslation("login");
    const schema = getValidationSchema(t);

    const [alertMessage, setAlertMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<"error" | "info" | "success" | "warning">("info");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<Inputs> = async ({ iin }) => {
        setAlertMessage("");
        setLoading(true);

        try {
            await api.post("/forgot-password", { iin });
            setAlertMessage(t("Инструкции по сбросу пароля отправлены на вашу почту"));
            setAlertSeverity("success");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 404 && error.response?.data?.message === "Пользователь с таким ИИН не найден.") {
                    setAlertMessage(t("Пользователь с таким ИИН не найден"));
                    setAlertSeverity("error");
                }
            } else {
                console.error(error);
                setAlertMessage(t("Ошибка при запросе сброса пароля"));
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
                    sx={{ width: "100%", maxWidth: 400 }}
                >
                    <header>
                        <Typography variant="h5" textAlign="center" mb={3}>
                            {t("Сброс пароля")}
                        </Typography>
                    </header>

                    {alertMessage && (
                        <Alert severity={alertSeverity} sx={{ mb: 2 }}>
                            {alertMessage}
                        </Alert>
                    )}
                    <section>
                        <TextField
                            label={`${t("Введите ИИН")}`}
                            placeholder={t("Введите ИИН")}
                            fullWidth
                            {...register("iin")}
                            error={!!errors.iin}
                            helperText={errors.iin?.message}
                            sx={{ mb: 3 }}
                        />

                        <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mb: 2 }}>
                            {loading ? <CircularProgress size={24} /> : t("Сбросить пароль")}
                        </Button>
                    </section>
                </Box>
                <section>
                    <LanguageSwitcher />
                </section>
            </Box>
        </main>
);
};

export default ForgotPassword;
