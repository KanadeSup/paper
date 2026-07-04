import type {
	GenerateTextInput,
	GenerateTextOptions,
	LlmProviderName,
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
}
