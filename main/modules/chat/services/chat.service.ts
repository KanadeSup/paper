import { randomUUID } from "node:crypto";
import { FileStorageService } from "@main/modules/file-system";
import type {
	ChatMessage,
	ChatModelConfiguration,
	ChatSession,
} from "../types/chat.type";

export class ChatService {
	private readonly fileStorageService = new FileStorageService();

	async createChatSession(
		documentId: string,
		modelConfiguration: ChatModelConfiguration,
	): Promise<ChatSession> {
		const chatSessionId = randomUUID();
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

	async appendMessages(
		sessionId: string,
		messages: ChatMessage[],
	): Promise<ChatSession | null> {
		const chatSession = await this.getChatSession(sessionId);
		if (!chatSession) {
			return null;
		}

		const updatedMessages = [...chatSession.messages, ...messages];
		const { records } = this.fileStorageService.getStorageData("chatSessions");
		const updatedRecords = records.map((record) =>
			record.id === sessionId
				? { ...record, messages: updatedMessages }
				: record,
		);

		this.fileStorageService.setCollectionRecords(
			"chatSessions",
			updatedRecords,
		);

		return {
			...chatSession,
			messages: updatedMessages,
		};
	}
}
