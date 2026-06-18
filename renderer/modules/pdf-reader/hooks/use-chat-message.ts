import { useCallback, useState } from "react";
import type {
	DisplayedAssistantChatMessage,
	DisplayedChatMessage,
	DisplayedUserChatMessage,
} from "../types/chat.type";

export type UseChatMessagesProps = {
	initialMessages?: DisplayedChatMessage[];
};

export function useChatMessages(props?: UseChatMessagesProps) {
	const [messages, setMessages] = useState<DisplayedChatMessage[]>(
		props?.initialMessages ?? [],
	);

	const addMessage = useCallback((message: DisplayedChatMessage) => {
		setMessages((prev) => [...prev, message]);
	}, []);

	/**
	 * Updates a chat message in the messages list.
	 *
	 * If the passed `id` is `null`, it will update the first message matching the given `role`
	 * that does not have an `id` (i.e., a pending user message or streaming assistant message).
	 * If `id` is provided, it updates the message matching both `id` and `role`.
	 */
	const updateMessage = useCallback(
		<T extends "user" | "assistant">(
			id: string | null,
			role: T,
			message: Partial<
				T extends "user"
					? DisplayedUserChatMessage
					: DisplayedAssistantChatMessage
			>,
		) => {
			setMessages((prevMessages) =>
				prevMessages.map((msg) => {
					const hasId = "id" in msg;

					if (id === null && !hasId && msg.role === role) {
						return { ...msg, ...message };
					}

					if (hasId && msg.id === id && msg.role === role) {
						return { ...msg, ...message };
					}

					return msg;
				}),
			);
		},
		[],
	);

	const clearMessages = useCallback(() => {
		setMessages([]);
	}, []);

	return { messages, addMessage, updateMessage, clearMessages, setMessages };
}
