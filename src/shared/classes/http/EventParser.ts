import { setUser } from '@sentry/serverless';

/*
  class: Parses event objects passed to lambda functions from API-Gateway.
*/
export default class EventParser {
	event: any;

	/**
	 * init
	 * @param {object} event - lambda event object
	 */
	constructor(event, isAdmin = false) {
		console.info('EVENT\n' + JSON.stringify(event, null, 2));
		this.event = event;

		if (!isAdmin) {
			const { userId, email } = this.getUser();

			setUser({
				id: userId,
				email: email,
				ip_address: this.event.requestContext.identity.sourceIp,
			});
		}
	}

	/**
	 * Returns userId from 'authorizer'.
	 * @returns {object} - { userId: string; email: string }
	 */
	getUser(): { userId: string; email: string } {
		try {
			return this.event['requestContext']['authorizer'];
		} catch (error) {
			console.error(error.toString());
			return { userId: '', email: '' };
		}
	}

	/**
	 * Returns http method from event structure.
	 * @returns {string} - http method
	 */
	getHttpMethod(): string {
		try {
			return this.event['requestContext']['httpMethod']; // HTTP: ['http']['method']
		} catch (error) {
			console.error(error.toString());
			throw new Error('http method not found');
		}
	}

	/**
	 * Returns parsed json body of event.
	 * @param {*} _default - dynamic: default return value no body is present
	 * @returns {object} - body of event || none if err
	 */
	getBody(_default = null) {
		const strjson = this.event.body || null;
		if (!strjson) return _default;
		if (typeof strjson === 'string') return JSON.parse(strjson);
		if (typeof strjson === 'object')
			return JSON.parse(JSON.stringify(strjson));
		throw new Error('invalid payload type');
	}

	/**
	 * Get the path parameter dictionary, if present, from the event object.
	 * @param {*} _default
	 * @returns {object} - path variables
	 */
	getPathParameters(_default = null) {
		return this.event['pathParameters'] || null;
	}

	/**
	 * Returns parsed json query params.
	 * @returns {object} - params || an empty dict
	 */
	getQueryParams() {
		const temp = this.event['queryStringParameters'] || {};
		return temp instanceof Object ? temp : {};
	}
}
