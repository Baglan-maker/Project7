'use client';

import { Suspense } from "react";
import ResetPasswordContent from "src/app/auth/reset-password/page";

const ResetPassword = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
};

export default ResetPassword;
