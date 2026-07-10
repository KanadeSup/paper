import OpenAI from "openai";
import type {
	GenerateTextInput,
	GenerateTextOptions,
	ProviderOptions,
	ValidateApiKeyResponse,
} from "../types/provider.type";
import type { LlmProvider } from "./llm-provider.interface";

const GROK_BASE_URL = "https://api.x.ai/v1";
const GROK_TIMEOUT_MS = 360_000;

export class GrokProvider implements LlmProvider {
	readonly name = "grok" as const;

	private readonly client: OpenAI;

	constructor(options: ProviderOptions) {
		this.client = new OpenAI({
			apiKey: options.apiKey,
			baseURL: GROK_BASE_URL,
			timeout: GROK_TIMEOUT_MS,
		});
	}

	async generateText(
		input: GenerateTextInput,
		options: GenerateTextOptions,
	): Promise<string> {
		const response = await this.client.responses.create({
			model: options.model,
			input: input,
			temperature: options.temperature,
			max_output_tokens: options.maxTokens,
			top_p: options.topP,
		});

		return response.output_text;
	}

	async *generateTextStream(
		input: GenerateTextInput,
		options: GenerateTextOptions,
	): AsyncGenerator<string> {
		const stream = await this.client.responses.create({
			model: options.model,
			input,
			temperature: options.temperature,
			max_output_tokens: options.maxTokens,
			top_p: options.topP,
			stream: true,
		});

		for await (const event of stream) {
			if (event.type === "response.output_text.delta") {
				yield event.delta;
			}
		}
	}

	async validateApiKey(apiKey: string): Promise<ValidateApiKeyResponse> {
		const validateClient = new OpenAI({
			apiKey,
			baseURL: GROK_BASE_URL,
			timeout: GROK_TIMEOUT_MS,
		});

		try {
			await validateClient.models.list();
			return {
				valid: true,
				message: null,
			};
		} catch (error) {
			return {
				valid: false,
				message: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}
}
