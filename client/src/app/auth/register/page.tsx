'use client';
import React from "react";
import RegisterForm from "./RegisterForm";
import LanguageSwitcher from "../../components/common/LanguageSwitcher";
import { useRouter } from "next/navigation";

const AuthPage = () => {
    const router = useRouter();

    return (
        <main>
            <section>
                <RegisterForm
                    onLoginRedirect={() => router.push("/auth/login")}
                />
            </section>
            <section>
                <LanguageSwitcher/>
            </section>
        </main>
);
};

export default AuthPage;
