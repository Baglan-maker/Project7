const Sentry = require("@sentry/node");

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    // integrations: [
    //     nodeProfilingIntegration(), // Интеграция для профилирования
    // ],
    tracesSampleRate: 1.0, // Отслеживаем 100% транзакций
});


Sentry.startSpan({
    name: "My First Transaction",
}, () => {
    // the code executing inside the transaction will be wrapped in a span and profiled
});

// Calls to stopProfiling are optional - if you don't stop the profiler, it will keep profiling
// your application until the process exits or stopProfiling is called.

module.exports = Sentry;
