import type {
	GenerateTextInput,
	GenerateTextOptions,
	LlmProviderName,
	ValidateApiKeyResponse,
} from "../types/provider.type";

export interface LlmProvider {
	readonly name: LlmProviderName;

	generateText(
		input: GenerateTextInput,
		options: GenerateTextOptions,
	): Promise<string>;

	generateTextStream(
		input: GenerateTextInput,
		options: GenerateTextOptions,
	): AsyncGenerator<string>;

	validateApiKey(apiKey: string): Promise<ValidateApiKeyResponse>;
}
