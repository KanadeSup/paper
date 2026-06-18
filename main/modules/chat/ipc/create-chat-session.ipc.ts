import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	CREATE_CHAT_SESSION_CHANNEL_NAME,
	type CreateChatSessionRequest,
	type CreateChatSessionResponse,
} from "@shared/chat/contracts/create-chat-session.contract";
import { ChatService } from "../services/chat.service";

export class CreateChatSessionChannel extends BaseChannel<
	CreateChatSessionRequest,
	CreateChatSessionResponse
> {
	private readonly chatService = new ChatService();

	getName(): string {
		return CREATE_CHAT_SESSION_CHANNEL_NAME;
	}

	async handle(
		_event: Electron.IpcMainInvokeEvent,
		request: CreateChatSessionRequest,
	): Promise<CreateChatSessionResponse> {
		const chatSession = await this.chatService.createChatSession(
			request.documentId,
			request.modelConfiguration,
		);

		return {
			sessionId: chatSession.id,
			documentId: chatSession.documentId,
			modelConfiguration: chatSession.modelConfiguration,
		};
	}
}
