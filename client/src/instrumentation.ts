import * as Sentry from '@sentry/nextjs';
import '../sentry.server.config';
import '../sentry.edge.config';



export const onRequestError = Sentry.captureRequestError;
