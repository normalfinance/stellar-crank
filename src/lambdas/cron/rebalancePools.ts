// Modules
import { AWSLambda } from '@sentry/serverless';

// Utils
import { initializeSentry } from '@/shared/utils/banana';

initializeSentry();

// Types
export type Request = {};

export const handler = AWSLambda.wrapHandler(async () => {
	const event: Request = {};

	// ...
});
