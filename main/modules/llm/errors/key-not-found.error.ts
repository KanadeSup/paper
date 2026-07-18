import { BaseError } from "@main/modules/common/errors/base.error";

export class KeyNotFoundError extends BaseError {
	constructor(message: string) {
		super(message, 400, "api-not-found");
	}
}
