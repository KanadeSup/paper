import { BaseError } from "@main/modules/common/errors/base.error";
import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	GENERATE_TEXT_WITH_PLACEHOLDER_CHANNEL_NAME,
	GENERATE_TEXT_WITH_PLACEHOLDER_CHUNK_CHANNEL_NAME,
	GENERATE_TEXT_WITH_PLACEHOLDER_ERROR_CHANNEL_NAME,
	GENERATE_TEXT_WITH_PLACEHOLDER_FINISH_CHANNEL_NAME,
	GENERATE_TEXT_WITH_PLACEHOLDER_START_CHANNEL_NAME,
	type GenerateTextWithPlaceholderRequest,
	type GenerateTextWithPlaceholderResponse,
} from "@shared/text-generation/contracts/generate-text-with-placeholder.contract";
import Logger from "electron-log/main.js";
import { TextGenerationService } from "../services/text-generation.service";

export class GenerateTextWithPlaceholderChannel extends BaseChannel<
	GenerateTextWithPlaceholderRequest,
	GenerateTextWithPlaceholderResponse
> {
	private readonly textGenerationService = new TextGenerationService();

	getName(): string {
		return GENERATE_TEXT_WITH_PLACEHOLDER_CHANNEL_NAME;
	}

	async handle(
		event: Electron.IpcMainInvokeEvent,
		request: GenerateTextWithPlaceholderRequest,
	): Promise<GenerateTextWithPlaceholderResponse> {
		const sender = event.sender;

		const resolvedPrompt = this.textGenerationService.applyPlaceholders(
			request.prompt,
			request.placeholderMap,
		);

		sender.send(GENERATE_TEXT_WITH_PLACEHOLDER_START_CHANNEL_NAME, {
			resolvedPrompt,
		});

		try {
			const stream = this.textGenerationService.generateTextStream(
				resolvedPrompt,
				request.model,
			);

			let contentBuffer = "";

			for await (const chunk of stream) {
				contentBuffer += chunk;
				sender.send(GENERATE_TEXT_WITH_PLACEHOLDER_CHUNK_CHANNEL_NAME, {
					chunk,
				});
			}

			sender.send(GENERATE_TEXT_WITH_PLACEHOLDER_FINISH_CHANNEL_NAME, {
				content: contentBuffer,
			});
		} catch (error) {
			Logger.error(
				`Failed during running generate text with placeholder ipc: ${error}`,
			);
			sender.send(GENERATE_TEXT_WITH_PLACEHOLDER_ERROR_CHANNEL_NAME, {
				errorMessage:
					error instanceof Error
						? error.message
						: "Failed to generate response",
				errorCode: error instanceof BaseError ? error.errorCode : undefined,
			});
		}

		return null;
	}
}
