export type LlmProviderName = "openai" | "gemini" | "grok";

export type ProviderOptions = {
	/** If not provided, the API key will be retrieved from the API key storage */
	apiKey?: string;
};

export type GenerateTextOptions = {
	model: string;
	temperature?: number;
	maxTokens?: number;
	topP?: number;
};

export type GenerateTextInput =
	| string
	| {
			role: "system" | "user" | "assistant";
			content: string;
	  }[];

export type ValidateApiKeyResponse = {
	valid: boolean;
	message: string | null;
};
