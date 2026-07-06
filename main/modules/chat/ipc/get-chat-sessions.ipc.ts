import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	GET_CHAT_SESSIONS_CHANNEL_NAME,
	type GetChatSessionsRequest,
	type GetChatSessionsResponse,
} from "@shared/chat/contracts/get-chat-sessions.contract";
import { ChatService } from "../services/chat.service";

export class GetChatSessionsChannel extends BaseChannel<
	GetChatSessionsRequest,
	GetChatSessionsResponse
> {
	private readonly chatService = new ChatService();

	getName(): string {
		return GET_CHAT_SESSIONS_CHANNEL_NAME;
	}

	async handle(
		_event: Electron.IpcMainInvokeEvent,
		request: GetChatSessionsRequest,
	): Promise<GetChatSessionsResponse> {
		const sessions = await this.chatService.getChatSessionsByDocument(
			request.documentId,
		);
		return {
			sessions,
		};
	}
}
