import EventResponseBuilder, { Payload } from '../EventResponseBuilder';

/**
 * class: Returns a raw http response.
 */
export default class RawBodyEvent extends EventResponseBuilder {
	/**
	 * init
	 * @param {*} body
	 */
	constructor(body = null) {
		super(200, body);
	}

	/**
	 * override of EventResponseBuilder build()
	 * @returns {object} - payload object
	 */
	build() {
		const payload: Payload = {
			statusCode: this.code,
		};
		try {
			if (this.body) {
				payload.headers = { 'Content-Type': 'application/json' };
				payload.body = this.body;
			}
		} catch (error) {
			console.error(error.toString());
			console.log('BUILD ERROR - ' + error.toString());
			payload.statusCode = 500;
			payload.body = JSON.stringify({
				message: 'error building response object',
			});
			payload.headers = {
				'Content-Type': 'application/json',
			};
		}
		return payload;
	}
}
