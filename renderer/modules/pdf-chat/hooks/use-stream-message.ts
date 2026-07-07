import { useEffect, useRef } from "react";
import type {
	ChatSessionAssistantMessage,
	ChatSessionMessage,
	ChatSessionUserMessage,
} from "../../pdf-chat/types/chat.type";
import {
	onSendChatMessageChunk,
	onSendChatMessageError,
	onSendChatMessageFinish,
	onSendChatMessageStart,
} from "../ipc/chat.ipc";

export type UseStreamMessageParams = {
	onStreaming?: (streamingMessage: string) => void;
	onFinish?: (responseMessage: ChatSessionAssistantMessage) => void;
	onStart?: (userMessage: ChatSessionUserMessage) => void;
	onError?: (error: ChatSessionAssistantMessage) => void;
};

export function useStreamMessage(params: UseStreamMessageParams) {
	const messageBuffer = useRef<string>("");
	const { onStreaming, onFinish, onStart, onError } = params;

	useEffect(() => {
		const handleMessageStreaming = (chunk: string) => {
			messageBuffer.current += chunk;
			onStreaming?.(messageBuffer.current);
		};

		const handleMessageFinish = (
			responseMessage: ChatSessionAssistantMessage,
		) => {
			onFinish?.(responseMessage);
		};

		const handleMessageError = (errorMessage: ChatSessionAssistantMessage) => {
			onError?.(errorMessage);
		};

		const handleMessageStart = (
			message: ChatSessionMessage & { role: "user" },
		) => {
			messageBuffer.current = "";
			onStart?.(message);
		};

		const onSendChatMessageStartUnsubscribe = onSendChatMessageStart(
			(response) => {
				const userMessage = response.userMessage;
				handleMessageStart({
					id: userMessage.id,
					role: "user",
					content: userMessage.content,
					createdAt: userMessage.createdAt,
				});
			},
		);

		const onSendChatMessageChunkUnsubscribe = onSendChatMessageChunk(
			(response) => handleMessageStreaming(response.chunk),
		);

		const onSendChatMessageErrorUnsubscribe = onSendChatMessageError(
			(response) => {
				const assistantMessage = response.assistantMessage;
				handleMessageError({
					id: assistantMessage.id,
					role: "assistant",
					content: assistantMessage.content,
					model: assistantMessage.model,
					isError: true,
					errorMessage: assistantMessage.errorMessage,
					errorCode: assistantMessage.errorCode,
					createdAt: assistantMessage.createdAt,
				});
			},
		);

		const onSendChatMessageFinishUnsubscribe = onSendChatMessageFinish(
			(response) => {
				const assistantMessage = response.assistantMessage;
				handleMessageFinish({
					id: assistantMessage.id,
					role: "assistant",
					content: assistantMessage.content,
					model: assistantMessage.model,
					createdAt: assistantMessage.createdAt,
				});
			},
		);

		return () => {
			onSendChatMessageStartUnsubscribe();
			onSendChatMessageChunkUnsubscribe();
			onSendChatMessageErrorUnsubscribe();
			onSendChatMessageFinishUnsubscribe();
		};
	}, [onStreaming, onFinish, onStart, onError]);
}
