class CustomError extends Error {
	extra: any;
	constructor(message, error) {
		super();
		// Error.captureStackTrace(this, this.constructor);
		this.name = 'CustomError';
		this.message = message;
		this.extra = error;
	}
}

class AWSServiceError extends Error {
	extra: any;
	constructor(message, error) {
		super();
		// Error.captureStackTrace(this, this.constructor);
		this.name = 'AWSServiceError';
		this.message = message;
		this.extra = error;
	}
}

/**
 *
 * Exchange Errors
 *
 */

class ExchangeError extends Error {
	exchangeId: string;

	constructor(exchangeId: string, message) {
		super();
		this.name = 'ExchangeError';
		this.message = message;
		this.exchangeId = exchangeId;
	}
}

export { CustomError, AWSServiceError, ExchangeError };
