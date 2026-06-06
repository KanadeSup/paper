export abstract class BaseError extends Error {
	statusCode: number;
	errorCode?: string;

	constructor(message: string, statusCode: number, errorCode?: string) {
		super(message);
		this.statusCode = statusCode;
		this.errorCode = errorCode;
	}
}
