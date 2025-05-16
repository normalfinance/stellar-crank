import { AWSLambda } from '@sentry/serverless';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export const environment = {
	dev: 'development',
	staging: 'staging',
	prod: 'production',
}[process.env.STAGE];

/**
 * Calls Sentry.init()
 */
export const initializeSentry = () => {
	AWSLambda.init({
		dsn: 'https://3a6606ef2fe5cba94ced85a0b1578fb7@o4504056500715520.ingest.us.sentry.io/4507196605726720',
		integrations: [nodeProfilingIntegration()],
		// Performance Monitoring
		tracesSampleRate: 1.0, //  Capture 100% of the transactions
		// Set sampling rate for profiling - this is relative to tracesSampleRate
		profilesSampleRate: 1.0,
		environment: environment,
		release: process.env.npm_package_version,
	});
};
