export type Payload = {
	statusCode: number;
	headers?: Record<string, any>;
	body?: any;
};

/**
 * class: Builds Event responses to be returned to API-Gateway.
 */
export default class EventResponseBuilder {
	code: number;
	body: Record<string, any>;

	/**
	 * init
	 * @param {int} code 	- http code to return
	 * @param {*} body 		- body/payload to return
	 */
	constructor(code = 200, body = null) {
		this.code = code;
		this.body = body;
	}

	/**
	 * Set http response code
	 * @param {int} code - integer http value
	 * @returns {this}
	 */
	set_code(code) {
		this.code = code;
		return this;
	}

	/**
	 * Get http response code
	 * @returns {int} - http response code
	 */
	get_code() {
		return this.code;
	}

	/**
	 * Set response body (note: will be json serialized; if type is primitive will be serialized as '{"data":<val>}' )
	 * @param {*} body
	 * @returns {this}
	 */
	set_body(body) {
		this.body = body;
		return this;
	}

	/**
	 * Get response body
	 * @returns {object} - body object
	 */
	get_body() {
		return this.body;
	}

	/**
	 * Build response object
	 * @returns {object} - payload object
	 */
	build() {
		const payload: Payload = {
			statusCode: this.code,
		};

		try {
			if (this.body) {
				// Log response
				// @dev Do NOT log tokenInfo as it's ~2MB large
				if (!this.body.hasOwnProperty('tokens'))
					console.info(
						'response\n' + JSON.stringify(this.body, null, 2)
					);

				payload.headers = {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Headers':
						'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent, X-Amzn-Trace-Id, sentry-trace, baggage',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': '*',
					'Access-Control-Allow-Credentials': false,
				};
				if (this.body instanceof Object) {
					payload.body = JSON.stringify(this.body); // json.dumps(self.body, use_decimal=True)
				} else {
					payload.body = JSON.stringify({ body: this.body }); // json.dumps({ 'body': self.body }, use_decimal=True)
				}
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
