import type { ApiKeys } from "../types/api-key.type";

export const GET_API_KEYS_CHANNEL_NAME = "get-api-keys";

export type GetApiKeysRequest = undefined;

export type GetApiKeysResponse = {
	apiKeys: ApiKeys;
};
