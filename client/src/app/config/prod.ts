const config = {
    googleCaptchaSecretKey: process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY,
    googleCaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    sentry_dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    prod_server_url: process.env.NEXT_PUBLIC_PROD_SERVER_URL,
};
export default config;