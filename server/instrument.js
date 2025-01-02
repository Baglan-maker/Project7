const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        nodeProfilingIntegration(), // Интеграция для профилирования
    ],
    tracesSampleRate: 1.0, // Отслеживаем 100% транзакций
});

module.exports = Sentry;
