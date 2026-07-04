import { randomUUID } from "node:crypto";
import { BaseError } from "@main/modules/common/errors/base.error";
import { NotFoundError } from "@main/modules/common/errors/common.error";
import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	ChatGenerateService,
	resolveProviderNameFromModel,
	TextGenerateService,
} from "@main/modules/llm";
import {
	SEND_CHAT_MESSAGE_CHUNK_CHANNEL_NAME,
	SEND_CHAT_MESSAGE_ERROR_CHANNEL_NAME,
	SEND_CHAT_MESSAGE_FINISH_CHANNEL_NAME,
	SEND_CHAT_MESSAGE_START_CHANNEL_NAME,
} from "@shared/chat/contracts/create-chat-session.contract";
import {
	SEND_MESSAGE_CHANNEL_NAME,
	type SendMessageAssistantMessage,
	type SendMessageRequest,
	type SendMessageResponse,
	type SendMessageUserMessage,
} from "@shared/chat/contracts/send-message.contract";
import Logger from "electron-log/main.js";
import { ChatService } from "../services/chat.service";

export class SendMessageChannel extends BaseChannel<
	SendMessageRequest,
	SendMessageResponse
> {
	private readonly chatService = new ChatService();
	private readonly chatGenerateService = new ChatGenerateService();

	getName(): string {
		return SEND_MESSAGE_CHANNEL_NAME;
	}

	async handle(
		event: Electron.IpcMainInvokeEvent,
		request: SendMessageRequest,
	): Promise<SendMessageResponse> {
		const chatSession = await this.chatService.getChatSession(
			request.sessionId,
		);

		if (!chatSession) throw new NotFoundError("Chat session not found");

		const sender = event.sender;

		const userMessage: SendMessageUserMessage = {
			id: randomUUID(),
			role: "user",
			content: request.message,
			createdAt: new Date(),
		};

		// Send start message (User query message) to the client
		sender.send(SEND_CHAT_MESSAGE_START_CHANNEL_NAME, {
			userMessage: userMessage,
		});

		// Save user message
		await this.chatService.appendMessages(request.sessionId, [userMessage]);

		try {
			// Initialize text generate service
			const providerName = resolveProviderNameFromModel(request.model);
			const textGenerateService = new TextGenerateService(providerName, {
				apiKey: process.env.GROK_API_KEY ?? "",
			});

			// Build input (conversation messages) for the text generation
			const input = await this.chatGenerateService.buildInput({
				userMessage: request.message,
				previousMessages: chatSession.messages,
				systemPrompt:
					chatSession.modelConfiguration.systemPromptWithPlaceholders ??
					undefined,
			});

			// Streaming text generation
			const generateOptions = {
				model: request.model,
				temperature: chatSession.modelConfiguration.temperature ?? undefined,
				maxTokens: chatSession.modelConfiguration.maxTokens ?? undefined,
				topP: chatSession.modelConfiguration.topP ?? undefined,
			};

			const stream = textGenerateService.generateTextStream(
				input,
				generateOptions,
			);

			let messageBuffer = "";

			for await (const chunk of stream) {
				messageBuffer += chunk;
				sender.send(SEND_CHAT_MESSAGE_CHUNK_CHANNEL_NAME, {
					chunk: chunk,
				});
			}

			// Save and send finish message (Full generated text) to the client
			const responseMessage: SendMessageAssistantMessage = {
				id: randomUUID(),
				role: "assistant",
				content: messageBuffer,
				createdAt: new Date(),
			};

			await this.chatService.appendMessages(request.sessionId, [
				{
					...responseMessage,
					model: request.model,
				},
			]);

			sender.send(SEND_CHAT_MESSAGE_FINISH_CHANNEL_NAME, {
				assistantMessage: responseMessage,
			});
		} catch (error) {
			const errorMessage = this.toAssistantErrorMessage(error);
			Logger.error(`Failed during running send message ipc: ${error}`);
			sender.send(SEND_CHAT_MESSAGE_ERROR_CHANNEL_NAME, {
				assistantMessage: errorMessage,
			});
		}

		return null;
	}

	private toAssistantErrorMessage(error: unknown): SendMessageAssistantMessage {
		return {
			id: randomUUID(),
			role: "assistant",
			content: "",
			isError: true,
			errorMessage:
				error instanceof Error ? error.message : "Failed to generate response",
			errorCode: error instanceof BaseError ? error.errorCode : undefined,
			createdAt: new Date(),
		};
	}
}
