import EventResponseBuilder from '../EventResponseBuilder';

/**
 * class: OK (http code=2xx) event.
 */
export default class EventSuccess extends EventResponseBuilder {
	/**
	 * init
	 * @param {*} body
	 * @param {number} code
	 */
	constructor(body = null, code = 200) {
		super(code, body);
	}
}
