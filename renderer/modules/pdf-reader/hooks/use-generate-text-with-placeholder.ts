import { useCallback, useEffect, useRef, useState } from "react";
import {
	generateTextWithPlaceholder,
	onGenerateTextWithPlaceholderChunk,
	onGenerateTextWithPlaceholderError,
	onGenerateTextWithPlaceholderFinish,
	onGenerateTextWithPlaceholderStart,
} from "../ipc/text-generation.ipc";

export type GenerateTextParams = {
	prompt: string;
	model: string;
};

export function useGenerateTextWithPlaceholder() {
	const [content, setContent] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const contentBufferRef = useRef("");

	useEffect(() => {
		const unsubscribeStart = onGenerateTextWithPlaceholderStart(() => {
			contentBufferRef.current = "";
			setContent("");
			setErrorMessage(null);
		});

		const unsubscribeChunk = onGenerateTextWithPlaceholderChunk((response) => {
			contentBufferRef.current += response.chunk;
			setContent(contentBufferRef.current);
		});

		const unsubscribeFinish = onGenerateTextWithPlaceholderFinish(
			(response) => {
				setContent(response.content);
				setIsStreaming(false);
			},
		);

		const unsubscribeError = onGenerateTextWithPlaceholderError((response) => {
			setErrorMessage(response.errorMessage);
			setIsStreaming(false);
		});

		return () => {
			unsubscribeStart();
			unsubscribeChunk();
			unsubscribeFinish();
			unsubscribeError();
		};
	}, []);

	const generate = useCallback(async (params: GenerateTextParams) => {
		contentBufferRef.current = "";
		setContent("");
		setErrorMessage(null);
		setIsStreaming(true);

		const response = await generateTextWithPlaceholder({
			prompt: params.prompt,
			placeholderMap: {},
			model: params.model,
		});

		if (!response.success) {
			setErrorMessage(response.errorMessage ?? "Failed to generate response");
			setIsStreaming(false);
		}
	}, []);

	const reset = useCallback(() => {
		contentBufferRef.current = "";
		setContent("");
		setErrorMessage(null);
		setIsStreaming(false);
	}, []);

	return {
		content,
		isStreaming,
		errorMessage,
		generate,
		reset,
	};
}
