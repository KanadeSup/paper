import type { GenerateTextInput } from "../types/provider.type";

export type InputMessage = {
	role: "system" | "user" | "assistant";
	content: string;
};

export type BuildInputParams = {
	userMessage: string;
	previousMessages: InputMessage[];
	systemPrompt?: string | null;
};

export class ChatGenerateService {
	async buildInput(params: BuildInputParams): Promise<GenerateTextInput> {
		const input: GenerateTextInput = [];

		if (params.systemPrompt) {
			input.push({ role: "system", content: params.systemPrompt });
		}

		for (const message of params.previousMessages) {
			input.push({
				role: message.role,
				content: message.content,
			});
		}

		input.push({ role: "user", content: params.userMessage });

		return input;
	}
}
