export type ChatSession = {
	id: string;
	documentId: string;
	modelConfiguration: ChatModelConfiguration;
	messages: ChatMessage[];
};

export type ChatModelConfiguration = {
	temperature?: number | null;
	maxTokens?: number | null;
	topP?: number | null;
	systemPromptWithPlaceholders: string;
};

export type ChatMessage = {
	id: string;
	role: "user" | "assistant";
	model?: string;
	content: string;
	createdAt: Date;
};
