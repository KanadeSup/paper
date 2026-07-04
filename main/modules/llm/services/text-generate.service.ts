import { LlmProviderFactory } from "../factories/provider.factory";
import type { LlmProvider } from "../providers/llm-provider.interface";
import type {
	GenerateTextInput,
	GenerateTextOptions,
	LlmProviderName,
	ProviderOptions,
} from "../types/provider.type";

export class TextGenerateService {
	private readonly providerFactory = new LlmProviderFactory();

	private readonly provider: LlmProvider;

	constructor(providerName: LlmProviderName, providerOptions: ProviderOptions) {
		this.provider = this.providerFactory.getProvider(
			providerName,
			providerOptions,
		);
	}

	generateText(
		input: GenerateTextInput,
		options: GenerateTextOptions,
	): Promise<string> {
		return this.provider.generateText(input, options);
	}

	generateTextStream(
		input: GenerateTextInput,
		options: GenerateTextOptions,
	): AsyncGenerator<string> {
		return this.provider.generateTextStream(input, options);
	}
}
