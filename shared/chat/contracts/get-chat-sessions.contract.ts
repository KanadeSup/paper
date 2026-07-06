export const GET_CHAT_SESSIONS_CHANNEL_NAME = "get-chat-sessions";

export type GetChatSessionsRequest = {
	documentId: string;
};

export type GetChatSessionsResponse = {
	sessions: ChatSession[];
};

export type ChatSession = {
	id: string;
	documentId: string;
	modelConfiguration: ChatSessionModelConfiguration;
	messages: ChatSessionMessage[];
};

export type ChatSessionMessage = {
	id: string;
	role: "user" | "assistant";
	model?: string;
	content: string;
	isError?: boolean;
	errorMessage?: string;
	errorCode?: string;
	createdAt: Date;
};

export type ChatSessionModelConfiguration = {
	temperature?: number | null;
	maxTokens?: number | null;
	topP?: number | null;
	systemPromptWithPlaceholders: string;
};
