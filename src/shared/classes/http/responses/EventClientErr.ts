import EventResponseBuilder from '../EventResponseBuilder';

/**
 *  class: Err (http: code=4xx) event.
 */
export default class EventClientErr extends EventResponseBuilder {
	/**
	 * init
	 * @param {number} code
	 * @param {string} message
	 * @param {*} body
	 */
	constructor(code = 400, message, body = null) {
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
		if (this.body) console.log('ClientErr - ' + this.body.toString());
		return super.build();
	}
}
