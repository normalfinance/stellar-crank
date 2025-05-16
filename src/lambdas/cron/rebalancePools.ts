// Modules
import { AWSLambda } from '@sentry/serverless';
import StepFunction from '@/shared/classes/aws/StepFunction';

// Utils
import { initializeSentry } from '@/shared/utils/banana';

// Types
import { StateMachine } from '@/shared/types/SFN';

initializeSentry();

// Types
export type Request = {};

export const handler = AWSLambda.wrapHandler(async () => {
	const event: Request = {};

	// ...
});
