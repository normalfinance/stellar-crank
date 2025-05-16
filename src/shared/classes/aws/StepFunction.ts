import {
	SFNClient,
	StartExecutionCommand,
	StartExecutionCommandInput,
	StartExecutionCommandOutput,
} from '@aws-sdk/client-sfn';
import { AWSServiceError } from '../http/Errors';

export default class StepFunction {
	client: SFNClient;

	constructor() {
		this.client = new SFNClient({ region: process.env.REGION });
	}

	async startExecution(
		stateMachine: string,
		args: Record<string, any>,
		idemKey?: string
	): Promise<StartExecutionCommandOutput> {
		try {
			let input: StartExecutionCommandInput = {
				stateMachineArn: `arn:aws:states:${process.env.REGION}:${process.env.AWS_ACCOUNT_ID}:stateMachine:${stateMachine}`,
				input: JSON.stringify(args),
			};

			if (idemKey) input.name = idemKey;

			const response = await this.client.send(
				new StartExecutionCommand(input)
			);
			console.info(
				'SFN:stateMachine:startExecution\n' +
					JSON.stringify(response, null, 2)
			);
			return response;
		} catch (error) {
			throw new AWSServiceError('Unable to start process', error);
		}
	}
}
