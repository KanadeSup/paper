import Logger from "electron-log/renderer.js";
import { useCallback, useEffect, useState } from "react";
import { sendMessage } from "../ipc/chat.ipc";
import type {
	ChatSessionAssistantMessage,
	ChatSessionUserMessage,
	DisplayedAssistantChatMessage,
	DisplayedUserChatMessage,
} from "../types/chat.type";
import { useChatMessages } from "./use-chat-message";
import { useChatSession } from "./use-chat-session";
import { useStreamMessage } from "./use-stream-message";

export type UseChatControllerProps = {
	documentId: string;
	sessionId?: string;
};

export function useChatController(props: UseChatControllerProps) {
	const {
		session,
		isLoading,
		error: sessionError,
		loadSession,
		createSession,
		clearSession,
		setSession,
	} = useChatSession();
	const { messages, addMessage, updateMessage, clearMessages, setMessages } =
		useChatMessages();
	const [isStreamingMessage, setIsStreamingMessage] = useState(false);

	// Helper functions for message stream
	const handleMessageStart = useCallback(
		(userMessage: ChatSessionUserMessage) => {
			setIsStreamingMessage(true);
			updateMessage(null, userMessage.role, {
				...userMessage,
				isPending: false,
			});
		},
		[updateMessage],
	);

	const handleStreamingMessage = useCallback(
		(streamingMessage: string) => {
			// because stream message is not finialized so that the id is not present,
			// so we use null to update the message
			updateMessage(null, "assistant", {
				content: streamingMessage,
			});
		},
		[updateMessage],
	);

	const handleMessageError = useCallback(
		(errorMessage: ChatSessionAssistantMessage) => {
			updateMessage(null, "assistant", {
				...errorMessage,
				isError: true,
				isStreaming: false,
				errorMessage: "Some error occurred, please try again",
			});
		},
		[updateMessage],
	);

	const handleMessageFinish = useCallback(
		(responseMessage: ChatSessionAssistantMessage) => {
			// because stream message is not finialized so that the id is not present, so we use null to update the message
			updateMessage(null, "assistant", {
				...responseMessage,
				isStreaming: false,
			});
			setIsStreamingMessage(false);
		},
		[updateMessage],
	);

	useStreamMessage({
		onStart: handleMessageStart,
		onStreaming: handleStreamingMessage,
		onFinish: handleMessageFinish,
		onError: handleMessageError,
	});

	/**
	 * Handles sending a user message in the chat.
	 *
	 * This function performs the following steps:
	 * 1. Creates a "pending" user chat message object, which indicates a message from the user
	 *    is awaiting server confirmation.
	 * 2. Creates a "streaming" assistant message object, which acts as a placeholder for the assistant's
	 *    response while it's being generated (streamed) by the LLM.
	 * 3. Adds both the pending user message and the assistant's streaming message to the messages list,
	 *    updating the UI immediately for responsive feedback.
	 * 4. Sends the user's message to the language model (LLM) backend for processing.
	 * 5. The rest of the logic is handled by the useMessageStream hook.
	 */
	const sendUserMessage = useCallback(
		async (sesionId: string, messageContent: string) => {
			try {
				// Prepare a new pending message from the user
				const pendingUserMessage: DisplayedUserChatMessage = {
					role: "user",
					isPending: true,
					content: messageContent,
				};

				// Prepare a placeholder streaming message from the assistant
				const streamingMessage: DisplayedAssistantChatMessage = {
					role: "assistant",
					content: "",
					isStreaming: true,
				};

				// Immediately add both the user and assistant placeholders to the chat UI
				addMessage(pendingUserMessage);
				addMessage(streamingMessage);

				// Send the actual user message to the backend language model for response
				await sendMessage({
					sessionId: sesionId,
					model: "grok-4.3",
					message: messageContent,
				});
			} catch (error) {
				// Log any errors that occur during the sending process
				Logger.error(error);
			}
		},
		[addMessage],
	);

	const startNewChat = useCallback(async () => {
		clearMessages();
		clearSession();
	}, [clearMessages, clearSession]);

	// Auto load session when sessionId is provided/changed
	useEffect(() => {
		if (!props.sessionId) return;
		if (props.sessionId === session?.id) return;

		loadSession(props.sessionId).then((chatSession) => {
			if (!chatSession) return;
			const filteredMessages = chatSession.messages.filter(
				(
					message,
				): message is ChatSessionUserMessage | ChatSessionAssistantMessage =>
					message.role === "user" || message.role === "assistant",
			);
			setMessages(
				filteredMessages.map((message) => {
					if (message.role === "user") {
						return {
							id: message.id,
							role: message.role,
							content: message.content,
							isPending: false,
							createdAt: message.createdAt,
						};
					}
					return {
						id: message.id,
						role: message.role,
						content: message.content,
						isStreaming: false,
						createdAt: message.createdAt,
					};
				}),
			);
		});
	}, [props.sessionId, session?.id, loadSession, setMessages]);

	return {
		// states
		session,
		messages,

		// loading states
		isLoading,
		isStreamingMessage,

		// actions
		loadSession,
		startNewChat,
		sendUserMessage,
		createSession,
		setMessages,
		setSession,

		// errors
		sessionError,
	};
}
