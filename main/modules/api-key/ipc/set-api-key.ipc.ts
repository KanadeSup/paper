import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	SET_API_KEY_CHANNEL_NAME,
	type SetApiKeyRequest,
	type SetApiKeyResponse,
} from "@shared/api-key/ipc/set-api-key.contract";
import { ApiKeyService } from "../services/api-key.service";

export class SetApiKeyChannel extends BaseChannel<
	SetApiKeyRequest,
	SetApiKeyResponse
> {
	private readonly apiKeyService = new ApiKeyService();

	getName(): string {
		return SET_API_KEY_CHANNEL_NAME;
	}

	async handle(
		_event: Electron.IpcMainInvokeEvent,
		request: SetApiKeyRequest,
	): Promise<SetApiKeyResponse> {
		this.apiKeyService.set(request.provider, request.apiKey);
		return true;
	}
}
