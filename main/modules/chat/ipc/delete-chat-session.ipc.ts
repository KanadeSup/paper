import { NotFoundError } from "@main/modules/common/errors/common.error";
import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	DELETE_CHAT_SESSION_CHANNEL_NAME,
	type DeleteChatSessionRequest,
	type DeleteChatSessionResponse,
} from "@shared/chat/contracts/delete-chat-session.contract";
import { ChatService } from "../services/chat.service";

export class DeleteChatSessionChannel extends BaseChannel<
	DeleteChatSessionRequest,
	DeleteChatSessionResponse
> {
	private readonly chatService = new ChatService();

	getName(): string {
		return DELETE_CHAT_SESSION_CHANNEL_NAME;
	}

	async handle(
		_event: Electron.IpcMainInvokeEvent,
		request: DeleteChatSessionRequest,
	): Promise<DeleteChatSessionResponse> {
		const isDeleted = await this.chatService.deleteChatSession(
			request.sessionId,
		);
		if (!isDeleted) {
			throw new NotFoundError("Chat session not found");
		}
		return null;
	}
}
