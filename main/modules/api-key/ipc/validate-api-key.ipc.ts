import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import { LLMValidateService } from "@main/modules/llm/services/llm-validate.service";
import {
	VALIDATE_API_KEY_CHANNEL_NAME,
	type ValidateApiKeyRequest,
	type ValidateApiKeyResponse,
} from "@shared/api-key/ipc/validate-api-key.contract";

export class ValidateApiKeyChannel extends BaseChannel<
	ValidateApiKeyRequest,
	ValidateApiKeyResponse
> {
	private readonly validateService = new LLMValidateService();

	getName(): string {
		return VALIDATE_API_KEY_CHANNEL_NAME;
	}

	async handle(
		_event: Electron.IpcMainInvokeEvent,
		request: ValidateApiKeyRequest,
	): Promise<ValidateApiKeyResponse> {
		const apiKey = request.apiKey;
		if (!apiKey) {
			return {
				valid: false,
				message: "No API key saved for this provider",
			};
		}

		return this.validateService.validate(request.provider, apiKey);
	}
}
