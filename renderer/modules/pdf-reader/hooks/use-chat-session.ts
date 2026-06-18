import Logger from "electron-log/renderer.js";
import { useCallback, useState } from "react";
import { createChatSession, getChatSession } from "../ipc/chat.ipc";
import type {
	ChatModelConfiguration,
	ChatSessionData,
} from "../types/chat.type";

export function useChatSession() {
	const [session, setSession] = useState<ChatSessionData | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadSession = useCallback(
		async (id: string): Promise<ChatSessionData | null> => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await getChatSession(id);
				if (!response.success) {
					setError(
						response.errorMessage ||
							"There is an error when loading chat session",
					);
					Logger.error(
						response.errorMessage || "Error when loading chat session",
					);
					return null;
				}
				const chatSession = response.data.session;
				setSession(chatSession);
				return chatSession;
			} catch (e) {
				if (e instanceof Error) {
					setError(e.message || "Something went wrong");
				} else {
					setError("Something went wrong");
				}
			} finally {
				setIsLoading(false);
			}
			return null;
		},
		[],
	);

	const createSession = useCallback(
		async (
			documentId: string,
			modelConfiguration: ChatModelConfiguration,
		): Promise<string | null> => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await createChatSession(
					documentId,
					modelConfiguration,
				);
				if (response.success) {
					const chatSession = response.data;
					setSession({
						id: chatSession.sessionId,
						documentId: chatSession.documentId,
						modelConfiguration: chatSession.modelConfiguration,
						messages: [],
					});
					return chatSession.sessionId;
				} else {
					setError("Something went wrong when creating chat session");
					Logger.error(
						response.errorMessage || "Error when creating chat session",
					);
					return null;
				}
			} catch (e) {
				setError(`Something went wrong: ${e}`);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	const clearSession = useCallback(() => {
		setSession(null);
	}, []);

	return {
		session,
		isLoading,
		error,
		loadSession,
		createSession,
		clearSession,
		setSession,
	};
}
