import { UnprocessableEntityError } from "@main/modules/common/errors/common.error";
import type { LlmProviderName } from "../types/provider.type";

export function resolveProviderNameFromModel(model: string): LlmProviderName {
	const normalizedModel = model.toLowerCase();

	if (normalizedModel.startsWith("grok")) {
		return "grok";
	}

	if (normalizedModel.startsWith("gemini")) {
		return "gemini";
	}
	if (normalizedModel.startsWith("gpt")) {
		return "openai";
	}

	throw new UnprocessableEntityError(
		`Cannot find provider name for model: ${model}`,
	);
}
