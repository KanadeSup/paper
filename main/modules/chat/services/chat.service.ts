import { FileStorageService } from "@main/modules/file-system";
import { v4 } from "uuid";
import type { ChatModelConfiguration, ChatSession } from "../types/chat.type";

export class ChatService {
	private readonly fileStorageService = new FileStorageService();

	async createChatSession(
		documentId: string,
		modelConfiguration: ChatModelConfiguration,
	): Promise<ChatSession> {
		const chatSessionId = v4();
		this.fileStorageService.createCollectionRecord("chatSessions", {
			id: chatSessionId,
			documentId: documentId,
			modelConfiguration: {
				temperature: modelConfiguration.temperature ?? null,
				maxTokens: modelConfiguration.maxTokens ?? null,
				topP: modelConfiguration.topP ?? null,
				systemPromptWithPlaceholders:
					modelConfiguration.systemPromptWithPlaceholders,
			},
			messages: [],
		});

		return {
			id: chatSessionId,
			documentId: documentId,
			modelConfiguration,
			messages: [],
		};
	}

	async getChatSession(sessionId: string): Promise<ChatSession | null> {
		const chatSession = this.fileStorageService.findCollectionRecord(
			"chatSessions",
			sessionId,
		);
		return chatSession;
	}
}
