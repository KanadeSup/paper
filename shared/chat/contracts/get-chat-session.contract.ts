export const GET_CHAT_SESSION_CHANNEL_NAME = "get-chat-session";

export type GetChatSessionRequest = {
	sessionId: string;
};

export type GetChatSessionResponse = {
	session: ChatSession;
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
