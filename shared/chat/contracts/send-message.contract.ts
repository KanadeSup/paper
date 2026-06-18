export const SEND_MESSAGE_CHANNEL_NAME = "send-message";

export type SendMessageRequest = {
	sessionId: string;
	model: string;
	message: string;
};

export type SendMessageResponse = null;

export type OnSendMessageStartResponse = {
	userMessage: SendMessageUserMessage;
};

export type OnSendMessageChunkResponse = {
	chunk: string;
};

export type OnSendMessageErrorResponse = {
	assistantMessage: SendMessageAssistantMessage;
};

export type OnSendMessageFinishResponse = {
	assistantMessage: SendMessageAssistantMessage;
};

export type SendMessageUserMessage = {
	id: string;
	role: "user";
	content: string;
	isError?: boolean;
	errorMessage?: string;
	errorCode?: string;
	createdAt: Date;
};

export type SendMessageAssistantMessage = {
	id: string;
	role: "assistant";
	content: string;
	isError?: boolean;
	errorMessage?: string;
	errorCode?: string;
	createdAt: Date;
};
