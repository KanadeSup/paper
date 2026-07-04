export type LlmProviderName = "openai" | "gemini" | "grok";

export type ProviderOptions = {
	apiKey: string;
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
