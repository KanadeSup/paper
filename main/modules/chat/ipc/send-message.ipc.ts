import { NotFoundError } from "@main/modules/common/errors/common.error";
import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	SEND_MESSAGE_CHANNEL_NAME,
	type SendMessageRequest,
	type SendMessageResponse,
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
		_event: Electron.IpcMainInvokeEvent,
		request: SendMessageRequest,
	): Promise<SendMessageResponse> {
		const chatSession = await this.chatService.getChatSession(
			request.sessionId,
		);

		if (!chatSession) throw new NotFoundError("Chat session not found");

		return null;
	}
}
