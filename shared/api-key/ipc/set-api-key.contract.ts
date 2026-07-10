import type { ApiKeyProvider } from "../types/api-key.type";

export const SET_API_KEY_CHANNEL_NAME = "set-api-key";

export type SetApiKeyRequest = {
	provider: ApiKeyProvider;
	apiKey: string;
};

export type SetApiKeyResponse = boolean;
