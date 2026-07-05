/* Session data */
export type ChatSessionData = {
	id: string;
	documentId: string;
	modelConfiguration: ChatModelConfiguration;
	messages: ChatSessionMessage[];
};

export type ChatModelConfiguration = {
	temperature?: number | null;
	maxTokens?: number | null;
	topP?: number | null;
	systemPromptWithPlaceholders: string;
};

/* Session message */
export type ChatSessionMessage = {
	id: string;
	role: "user" | "assistant";
	content: string;
	isError?: boolean;
	errorMessage?: string;
	errorCode?: string;
	createdAt: Date;
};

export type ChatSessionUserMessage = ChatSessionMessage & {
	role: "user";
};

export type ChatSessionAssistantMessage = ChatSessionMessage & {
	role: "assistant";
	model: string;
};

/* Displayed message */
export type DisplayedUserChatMessage = Omit<
	ChatSessionUserMessage,
	"id" | "createdAt"
> &
	(
		| {
				isPending: true;
		  }
		| {
				id: string;
				isPending: false | undefined;
				createdAt: Date;
		  }
	);

export type DisplayedAssistantChatMessage = Omit<
	ChatSessionAssistantMessage,
	"id" | "createdAt"
> &
	(
		| {
				isStreaming: true;
		  }
		| {
				id: string;
				isStreaming: false;
				createdAt: Date;
		  }
	);

export type DisplayedChatMessage =
	| DisplayedUserChatMessage
	| DisplayedAssistantChatMessage;
