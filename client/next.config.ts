import {withSentryConfig} from '@sentry/nextjs';
import type { NextConfig } from "next";
import type { Configuration } from 'webpack';


const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
    async rewrites() {
        const serverUrl =
            process.env.NODE_ENV === 'production'
                ? process.env.NEXT_PUBLIC_PROD_SERVER_URL
                : process.env.NEXT_PUBLIC_DEV_SERVER_URL;

        return [
            {
                source: '/api/:path*',
                destination: `${serverUrl}/api/:path*`,
            },
        ];
    },

    webpack: (config: Configuration ) => {
        // Подавляем предупреждения Webpack
        if (config.module) {
            config.module.exprContextCritical = false;
        }
        return config;
    },
};


export default withSentryConfig(nextConfig, {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: "astanait",
    project: "javascript-nextjs",

    // Only print logs for uploading source maps in CI
    silent: true,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Automatically annotate React components to show their full name in breadcrumbs and session replay
    reactComponentAnnotation: {
    enabled: true,
    },

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
});

