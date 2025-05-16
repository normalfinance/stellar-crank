// Modules
import { AWSLambda } from '@sentry/serverless';
import {
	EventParser,
	EventSuccess,
	EventClientErr,
	EventServerErr,
} from '@/shared/classes/http';

// Utils
import { initializeSentry } from '@/shared/utils/banana';

// Types
import { EventErrorMessage } from '@/shared/types/error';

initializeSentry();

// Types
export type Request = {
	investmentId: string;
};

export type Response = {
	success: boolean;
};

export const handler = AWSLambda.wrapHandler(async (event: any) => {
	try {
		const eventParser = new EventParser(event);
		// const { userId } = eventParser.getUser();
		const { investmentId }: Request = eventParser.getBody();

		if (!investmentId) {
			return new EventClientErr(
				400,
				EventErrorMessage.INVALID_PARAMETERS
			).build();
		}

		// ...

		return new EventSuccess(
			{
				success: true,
			},
			202
		).build();
	} catch (error) {
		return new EventServerErr(error.message, error).build();
	}
});
