'use client';

import { Suspense } from "react";
import ResetPasswordContent from "src/app/auth/reset-password/page";
import {useSearchParams} from "next/navigation";
import {Alert} from "@mui/material";

const ResetPassword = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    if (!token) return <Alert severity="error">Invalid token.</Alert>;

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent token={token} />
        </Suspense>
    );
};

export default ResetPassword;
