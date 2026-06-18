export const CREATE_CHAT_SESSION_CHANNEL_NAME = "create-chat-session";
export const SEND_CHAT_MESSAGE_START_CHANNEL_NAME = "send-chat-message-start";
export const SEND_CHAT_MESSAGE_CHUNK_CHANNEL_NAME = "send-chat-message-chunk";
export const SEND_CHAT_MESSAGE_ERROR_CHANNEL_NAME = "send-chat-message-error";
export const SEND_CHAT_MESSAGE_FINISH_CHANNEL_NAME = "send-chat-message-finish";

export type CreateChatSessionRequest = {
	documentId: string;
	modelConfiguration: CreateChatModelConfigurationRequest;
};

export type CreateChatSessionResponse = {
	sessionId: string;
	documentId: string;
	modelConfiguration: CreateChatModelConfigurationResponse;
};

export type CreateChatModelConfiguration = {
	temperature?: number | null;
	maxTokens?: number | null;
	topP?: number | null;
	systemPromptWithPlaceholders: string;
};

export type CreateChatModelConfigurationRequest = CreateChatModelConfiguration;
export type CreateChatModelConfigurationResponse = CreateChatModelConfiguration;
