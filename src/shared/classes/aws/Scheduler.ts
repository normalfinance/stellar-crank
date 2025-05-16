import {
	SchedulerClient,
	CreateScheduleCommand,
	CreateScheduleCommandInput,
	DeleteScheduleCommand,
	DeleteScheduleCommandInput,
	UpdateScheduleCommand,
	UpdateScheduleCommandInput,
	CreateScheduleGroupCommand,
	CreateScheduleGroupCommandInput,
	GetScheduleGroupCommand,
	GetScheduleGroupCommandInput,
} from '@aws-sdk/client-scheduler';
import { AWSServiceError } from '../http/Errors';
import { captureException } from '@sentry/serverless';

export const ScheduleExecutorLambdaARN = `arn:aws:lambda:${process.env.REGION}:${process.env.AWS_ACCOUNT_ID}:function:normal-api-main-${process.env.STAGE}-scheduleExecutor`;
export const ScheduleExecutorRoleARN = `arn:aws:iam::${process.env.AWS_ACCOUNT_ID}:role/normal-api-main-${process.env.STAGE}-ScheduleExecutorLambdaFunction${process.env.IAM_SCHEDULE_EXECUTOR_ROLE_SUFFIX}`;

/**
 *
 */
export default class Scheduler {
	client: SchedulerClient;

	/**
	 *
	 */
	constructor() {
		this.client = new SchedulerClient({
			region: process.env.REGION,
		});
	}

	async getScheduleGroup(params: GetScheduleGroupCommandInput) {
		try {
			return await this.client.send(new GetScheduleGroupCommand(params));
		} catch (error) {
			if (error.name === 'ResourceNotFoundException') return false;
			else {
				captureException(error);
				throw new AWSServiceError(
					'Unable to get schedule group',
					error
				);
			}
		}
	}

	async createScheduleGroup(params: CreateScheduleGroupCommandInput) {
		try {
			return await this.client.send(
				new CreateScheduleGroupCommand(params)
			);
		} catch (error) {
			captureException(error);
			throw new AWSServiceError('Unable to create schedule group', error);
		}
	}

	/**
	 *
	 * @param params
	 * @returns
	 */
	async createSchedule(params: CreateScheduleCommandInput) {
		try {
			return await this.client.send(new CreateScheduleCommand(params));
		} catch (error) {
			captureException(error);
			throw new AWSServiceError('Unable to create schedule', error);
		}
	}

	async updateSchedule(params: UpdateScheduleCommandInput) {
		try {
			return await this.client.send(new UpdateScheduleCommand(params));
		} catch (error) {
			captureException(error);
			throw new AWSServiceError('Unable to update schedule', error);
		}
	}

	async deleteSchedule(params: DeleteScheduleCommandInput) {
		try {
			return await this.client.send(new DeleteScheduleCommand(params));
		} catch (error) {
			captureException(error);
			throw new AWSServiceError('Unable to delete schedule', error);
		}
	}
}
