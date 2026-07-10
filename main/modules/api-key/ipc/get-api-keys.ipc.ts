import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	GET_API_KEYS_CHANNEL_NAME,
	type GetApiKeysRequest,
	type GetApiKeysResponse,
} from "@shared/api-key/ipc/get-api-keys.contract";
import { ApiKeyService } from "../services/api-key.service";

export class GetApiKeysChannel extends BaseChannel<
	GetApiKeysRequest,
	GetApiKeysResponse
> {
	private readonly apiKeyService = new ApiKeyService();

	getName(): string {
		return GET_API_KEYS_CHANNEL_NAME;
	}

	async handle(): Promise<GetApiKeysResponse> {
		return {
			apiKeys: this.apiKeyService.getAll(),
		};
	}
}
