import { LlmProviderFactory } from "../factories/provider.factory";
import type { LlmProvider } from "../providers/llm-provider.interface";
import type {
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

	generateText(prompt: string, options: GenerateTextOptions): Promise<string> {
		return this.provider.generateText(prompt, options);
	}

	generateTextStream(
		prompt: string,
		options: GenerateTextOptions,
	): AsyncGenerator<string> {
		return this.provider.generateTextStream(prompt, options);
	}
}
