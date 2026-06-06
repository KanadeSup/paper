import { IpcResponseStatusCodes } from "../constants/ipc-channel.constant";
import { BaseError } from "./base.error";

export class BadRequestError extends BaseError {
	constructor(message: string, errorCode?: string) {
		super(message, IpcResponseStatusCodes.BAD_REQUEST, errorCode);
	}
}

export class NotFoundError extends BaseError {
	constructor(message: string, errorCode?: string) {
		super(message, IpcResponseStatusCodes.NOT_FOUND, errorCode);
	}
}

export class InternalError extends BaseError {
	constructor(message: string, errorCode?: string) {
		super(message, IpcResponseStatusCodes.INTERNAL_ERROR, errorCode);
	}
}

export class UnprocessableEntityError extends BaseError {
	constructor(message: string, errorCode?: string) {
		super(message, IpcResponseStatusCodes.UNPROCESSABLE_ENTITY, errorCode);
	}
}
