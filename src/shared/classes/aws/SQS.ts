import {
	SQSClient,
	SendMessageCommand,
	SendMessageBatchCommand,
	SendMessageCommandInput,
	SendMessageBatchCommandInput,
} from '@aws-sdk/client-sqs';
import { AWSServiceError } from '../http/Errors';

/**
 *
 */
export default class SQS {
	client: SQSClient;

	/**
	 *
	 */
	constructor() {
		this.client = new SQSClient({ region: process.env.REGION });
	}

	async sendMessage(args: SendMessageCommandInput) {
		try {
			return await this.client.send(new SendMessageCommand(args));
		} catch (error) {
			throw new AWSServiceError('Unable to send message', error);
		}
	}

	async sendMessageBatch(args: SendMessageBatchCommandInput) {
		try {
			return await this.client.send(new SendMessageBatchCommand(args));
		} catch (error) {
			throw new AWSServiceError('Unable to send message batch', error);
		}
	}
}
