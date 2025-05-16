export enum HTTPErrorMessage {
	ONLY_GET = 'Only GET is accepted',
	ONLY_POST = 'Only POST is accepted',
	ONLY_PUT = 'Only PUT is accepted',
	ONLY_DELETE = 'Only DELETE is accepted',
}

export enum EventErrorMessage {
	INVALID_PARAMETERS = 'Invalid parameters',
}

export enum DatabaseErrorMessage {
	NO_INDEX_FOUND = 'No index found',
	NO_EXCHANGE_FOUND = 'No exchange found',
	DUPLICATE_INVESTMENT = 'Investment already processed',
	INDEX_EXISTS = 'Index already exists',
	CANNOT_UPDATE_PUBLIC_INDEX = 'Cannot update public index',
}

export enum ExchangeErrorMessage {
	CANNOT_CREATE_CLIENT = 'Cannot create client',
	NSF = 'Insufficient funds',
	NO_ORDERS_EXECUTED = 'No orders executed',
}

export enum NormalErrorMessage {
	ONLY_USD = 'Investments limited to USD',
	ONLY_COINBASE_DEPOSITS = 'Deposits only supported for Coinbase',
	UNSUPPORTED_EXCHANGE = 'Unsupported exchange',
	FAILED_PAYMENT = 'Failed payment - please fix to continue using Normal',
}
