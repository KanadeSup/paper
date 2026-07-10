import { LlmProviderFactory } from "../factories/provider.factory";
import type {
	LlmProviderName,
	ValidateApiKeyResponse,
} from "../types/provider.type";

export class LLMValidateService {
	private readonly providerFactory = new LlmProviderFactory();

	async validate(
		providerName: LlmProviderName,
		apiKey: string,
	): Promise<ValidateApiKeyResponse> {
		const provider = this.providerFactory.getProvider(providerName, {
			apiKey,
		});
		return provider.validateApiKey(apiKey);
	}
}
