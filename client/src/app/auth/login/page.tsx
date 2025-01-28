'use client';
import React, {Suspense} from "react";
import LoginForm from "./AuthForm";
import { useRouter } from "next/navigation";
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
import { useSearchParams } from "next/navigation";
import {Alert} from "@mui/material";
import {useTranslation} from "react-i18next";

const LoginPage = () => {
    const router = useRouter();

    return (
        <main>
            <Suspense fallback={<div>Loading...</div>}>
                <ReasonAlert />
            </Suspense>
            <section>
                <LoginForm
                    onRegisterRedirect={() => router.push("/auth/register")}
                    onDashboardRedirect={() => router.push("/dashboard")}
                />
            </section>
            <section>
                <LanguageSwitcher />
            </section>
        </main>
    );
};

const ReasonAlert = () => {
    const searchParams = useSearchParams();
    const reason = searchParams.get("reason");
    const { t } = useTranslation('dashboard');

    if (reason === "noAccessToken") {
        return (
            <Alert severity="warning" sx={{ marginBottom: 2 }}>
                {t("Срок действия вашей сессии истёк. Пожалуйста, войдите снова.")}
            </Alert>
        );
    }

    return null;
};

export default LoginPage;
