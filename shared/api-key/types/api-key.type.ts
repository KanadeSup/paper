export const API_KEY_PROVIDER_IDS = ["grok", "gemini", "openai"] as const;

export type ApiKeyProvider = (typeof API_KEY_PROVIDER_IDS)[number];

export type ApiKeys = Record<ApiKeyProvider, string | null>;

export function isApiKeyProvider(value: string): value is ApiKeyProvider {
	return (API_KEY_PROVIDER_IDS as readonly string[]).includes(value);
}
