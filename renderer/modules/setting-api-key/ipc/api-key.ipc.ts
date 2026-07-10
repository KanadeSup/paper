import { invoke } from "@renderer/modules/design-system/ipc/base.ipc";
import {
	GET_API_KEYS_CHANNEL_NAME,
	type GetApiKeysResponse,
} from "@shared/api-key/ipc/get-api-keys.contract";
import {
	SET_API_KEY_CHANNEL_NAME,
	type SetApiKeyRequest,
	type SetApiKeyResponse,
} from "@shared/api-key/ipc/set-api-key.contract";

export function getApiKeys() {
	return invoke<undefined, GetApiKeysResponse>(
		GET_API_KEYS_CHANNEL_NAME,
		undefined,
	);
}

export function setApiKey(request: SetApiKeyRequest) {
	return invoke<SetApiKeyRequest, SetApiKeyResponse>(
		SET_API_KEY_CHANNEL_NAME,
		request,
	);
}
