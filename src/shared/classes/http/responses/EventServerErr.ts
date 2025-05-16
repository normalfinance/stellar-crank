import { captureException } from '@sentry/serverless';
import { ExchangeError } from '../Errors';
import EventResponseBuilder from '../EventResponseBuilder';

/**
 * class: Server Error (http: code=5xx).
 */
export default class EventServerErr extends EventResponseBuilder {
	/**
	 * init
	 * @param {string} message
	 * @param {*} body
	 */
	constructor(message, body = null) {
		let code = 500;

		captureException(new Error(body));

		console.error(message.toString());
		if (body) console.error(body.toString());

		if (body instanceof ExchangeError) {
			code = 502;
		}

		const _body = {
			error: true,
			msg: message,
			...(body && { body: body }),
		};
		super(code, _body);
	}

	/**
	 * override of EventResponseBuilder build()
	 * @returns {object} - payload object
	 */
	build() {
		if (this.body) console.log('EventServerErr - ' + this.body.toString());
		return super.build();
	}
}
