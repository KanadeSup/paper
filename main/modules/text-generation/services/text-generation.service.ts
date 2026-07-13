import {
	resolveProviderNameFromModel,
	TextGenerateService,
} from "@main/modules/llm";

export class TextGenerationService {
	applyPlaceholders(
		prompt: string,
		placeholderMap: Record<string, string>,
	): string {
		let resolvedPrompt = prompt;

		for (const [name, value] of Object.entries(placeholderMap)) {
			const token = name.startsWith("{{") ? name : `{{${name}}}`;
			resolvedPrompt = resolvedPrompt.split(token).join(value);
		}

		return resolvedPrompt;
	}

	generateTextStream(
		resolvedPrompt: string,
		model: string,
	): AsyncGenerator<string> {
		const providerName = resolveProviderNameFromModel(model);
		const textGenerateService = new TextGenerateService(providerName, {
			apiKey: process.env.GROK_API_KEY ?? "",
		});

		return textGenerateService.generateTextStream(resolvedPrompt, {
			model,
		});
	}
}
