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

	async getChatSessionsByDocument(documentId: string): Promise<ChatSession[]> {
		const { records } = this.fileStorageService.getStorageData("chatSessions");
		return records.filter((session) => session.documentId === documentId);
	}

	async appendMessages(
		sessionId: string,
		messages: ChatMessage[],
	): Promise<ChatSession | null> {
		const { records } = this.fileStorageService.getStorageData("chatSessions");
		const targetSessionIndex = records.findIndex(
			(session) => session.id === sessionId,
		);
		if (targetSessionIndex === -1) {
			return null;
		}

		const targetSession = records[targetSessionIndex];
		const updatedSession = {
			...targetSession,
			messages: [...targetSession.messages, ...messages],
		};

		records[targetSessionIndex] = updatedSession;
		this.fileStorageService.setCollectionRecords("chatSessions", records);

		return updatedSession;
	}

	async deleteChatSession(sessionId: string): Promise<boolean> {
		const { records } = this.fileStorageService.getStorageData("chatSessions");
		const nextRecords = records.filter((session) => session.id !== sessionId);
		if (nextRecords.length === records.length) {
			return false;
		}

		this.fileStorageService.setCollectionRecords("chatSessions", nextRecords);
		return true;
	}
}
