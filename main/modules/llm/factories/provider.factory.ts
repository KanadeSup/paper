import { GrokProvider } from "../providers/grok.provider";
import type { LlmProvider } from "../providers/llm-provider.interface";
import type { LlmProviderName, ProviderOptions } from "../types/provider.type";

export class LlmProviderFactory {
	getProvider(name: LlmProviderName, options: ProviderOptions): LlmProvider {
		switch (name) {
			case "grok":
				return new GrokProvider(options);
			case "openai":
			case "gemini":
				throw new Error(`LLM provider "${name}" is not implemented yet`);
			default: {
				throw new Error(`Unknown LLM provider: ${name}`);
			}
		}
	}
}
