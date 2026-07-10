import type { ApiKeyProvider } from "../types/api-key.type";

export const VALIDATE_API_KEY_CHANNEL_NAME = "validate-api-key";

export type ValidateApiKeyRequest = {
	provider: ApiKeyProvider;
	apiKey: string;
};

export type ValidateApiKeyResponse = {
	valid: boolean;
	message: string | null;
};
