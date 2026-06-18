import { NotFoundError } from "@main/modules/common/errors/common.error";
import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	GET_CHAT_SESSION_CHANNEL_NAME,
	type GetChatSessionRequest,
	type GetChatSessionResponse,
} from "@shared/chat/contracts/get-chat-session.contract";
import { ChatService } from "../services/chat.service";

export class GetChatSessionChannel extends BaseChannel<
	GetChatSessionRequest,
	GetChatSessionResponse
> {
	private readonly chatService = new ChatService();

	getName(): string {
		return GET_CHAT_SESSION_CHANNEL_NAME;
	}

	async handle(
		_event: Electron.IpcMainInvokeEvent,
		request: GetChatSessionRequest,
	): Promise<GetChatSessionResponse> {
		const chatSession = await this.chatService.getChatSession(
			request.sessionId,
		);
		if (!chatSession) throw new NotFoundError("Chat session not found");
		return {
			session: chatSession,
		};
	}
}
