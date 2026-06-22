import { randomUUID } from "node:crypto";
import { NotFoundError } from "@main/modules/common/errors/common.error";
import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	SEND_CHAT_MESSAGE_CHUNK_CHANNEL_NAME,
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
import { ChatService } from "../services/chat.service";

export class SendMessageChannel extends BaseChannel<
	SendMessageRequest,
	SendMessageResponse
> {
	private readonly chatService = new ChatService();

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

		sender.send(SEND_CHAT_MESSAGE_START_CHANNEL_NAME, {
			userMessage: userMessage,
		});

		let messageBuffer = "";

		for await (const chunk of fakeStream()) {
			messageBuffer += chunk;
			sender.send(SEND_CHAT_MESSAGE_CHUNK_CHANNEL_NAME, {
				chunk: messageBuffer,
			});
		}

		const responseMessage: SendMessageAssistantMessage = {
			id: randomUUID(),
			role: "assistant",
			content: messageBuffer,
			createdAt: new Date(),
		};

		sender.send(SEND_CHAT_MESSAGE_FINISH_CHANNEL_NAME, {
			assistantMessage: responseMessage,
		});

		return null;
	}
}

async function* fakeStream() {
	yield "Hello ";
	yield "World";
	yield "!";
}
