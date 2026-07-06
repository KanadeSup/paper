import { invoke, onIpc } from "@renderer/modules/design-system/ipc/base.ipc";
import {
	CREATE_CHAT_SESSION_CHANNEL_NAME,
	type CreateChatSessionRequest,
	type CreateChatSessionResponse,
	SEND_CHAT_MESSAGE_CHUNK_CHANNEL_NAME,
	SEND_CHAT_MESSAGE_ERROR_CHANNEL_NAME,
	SEND_CHAT_MESSAGE_FINISH_CHANNEL_NAME,
	SEND_CHAT_MESSAGE_START_CHANNEL_NAME,
} from "@shared/chat/contracts/create-chat-session.contract";
import {
	DELETE_CHAT_SESSION_CHANNEL_NAME,
	type DeleteChatSessionRequest,
	type DeleteChatSessionResponse,
} from "@shared/chat/contracts/delete-chat-session.contract";
import {
	GET_CHAT_SESSION_CHANNEL_NAME,
	type GetChatSessionRequest,
	type GetChatSessionResponse,
} from "@shared/chat/contracts/get-chat-session.contract";
import {
	GET_CHAT_SESSIONS_CHANNEL_NAME,
	type GetChatSessionsRequest,
	type GetChatSessionsResponse,
} from "@shared/chat/contracts/get-chat-sessions.contract";
import {
	type OnSendMessageChunkResponse,
	type OnSendMessageErrorResponse,
	type OnSendMessageFinishResponse,
	type OnSendMessageStartResponse,
	SEND_MESSAGE_CHANNEL_NAME,
	type SendMessageRequest,
	type SendMessageResponse,
} from "@shared/chat/contracts/send-message.contract";
import type { ChatModelConfiguration } from "../types/chat.type";

type SendMessageParams = {
	sessionId: string;
	model: string;
	message: string;
};

export function sendMessage(params: SendMessageParams) {
	return invoke<SendMessageRequest, SendMessageResponse>(
		SEND_MESSAGE_CHANNEL_NAME,
		{
			sessionId: params.sessionId,
			model: params.model,
			message: params.message,
		},
	);
}

export function createChatSession(
	documentId: string,
	modelConfiguration: ChatModelConfiguration,
) {
	return invoke<CreateChatSessionRequest, CreateChatSessionResponse>(
		CREATE_CHAT_SESSION_CHANNEL_NAME,
		{
			documentId,
			modelConfiguration,
		},
	);
}

export function getChatSession(sessionId: string) {
	return invoke<GetChatSessionRequest, GetChatSessionResponse>(
		GET_CHAT_SESSION_CHANNEL_NAME,
		{ sessionId: sessionId },
	);
}

export function getChatSessions(documentId: string) {
	return invoke<GetChatSessionsRequest, GetChatSessionsResponse>(
		GET_CHAT_SESSIONS_CHANNEL_NAME,
		{ documentId },
	);
}

export function deleteChatSession(sessionId: string) {
	return invoke<DeleteChatSessionRequest, DeleteChatSessionResponse>(
		DELETE_CHAT_SESSION_CHANNEL_NAME,
		{ sessionId },
	);
}

export function onSendChatMessageStart(
	listener: (response: OnSendMessageStartResponse) => void,
) {
	onIpc<OnSendMessageStartResponse>(
		SEND_CHAT_MESSAGE_START_CHANNEL_NAME,
		(_, response: OnSendMessageStartResponse) => listener(response),
	);
	return () => {
		window.electron.ipcRenderer.removeAllListeners(
			SEND_CHAT_MESSAGE_START_CHANNEL_NAME,
		);
	};
}

export function onSendChatMessageChunk(
	listener: (response: OnSendMessageChunkResponse) => void,
) {
	onIpc<OnSendMessageChunkResponse>(
		SEND_CHAT_MESSAGE_CHUNK_CHANNEL_NAME,
		(_, response: OnSendMessageChunkResponse) => listener(response),
	);
	return () => {
		window.electron.ipcRenderer.removeAllListeners(
			SEND_CHAT_MESSAGE_CHUNK_CHANNEL_NAME,
		);
	};
}

export function onSendChatMessageError(
	listener: (response: OnSendMessageErrorResponse) => void,
) {
	onIpc<OnSendMessageErrorResponse>(
		SEND_CHAT_MESSAGE_ERROR_CHANNEL_NAME,
		(_, response: OnSendMessageErrorResponse) => listener(response),
	);
	return () => {
		window.electron.ipcRenderer.removeAllListeners(
			SEND_CHAT_MESSAGE_ERROR_CHANNEL_NAME,
		);
	};
}

export function onSendChatMessageFinish(
	listener: (response: OnSendMessageFinishResponse) => void,
) {
	onIpc<OnSendMessageFinishResponse>(
		SEND_CHAT_MESSAGE_FINISH_CHANNEL_NAME,
		(_, response: OnSendMessageFinishResponse) => listener(response),
	);
	return () => {
		window.electron.ipcRenderer.removeAllListeners(
			SEND_CHAT_MESSAGE_FINISH_CHANNEL_NAME,
		);
	};
}
