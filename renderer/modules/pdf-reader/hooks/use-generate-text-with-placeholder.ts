import { useScrollCapability } from "@embedpdf/plugin-scroll/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	generateTextWithPlaceholder,
	onGenerateTextWithPlaceholderChunk,
	onGenerateTextWithPlaceholderError,
	onGenerateTextWithPlaceholderFinish,
	onGenerateTextWithPlaceholderStart,
} from "../ipc/text-generation.ipc";
import { usePdfReaderStore } from "../provider/pdf-reader-provider";
import { getOutlinePathStringByPageNumber } from "../utils/pdf.utils";

export type GenerateTextParams = {
	selectedText: string;
	prompt: string;
	model: string;
};

export function useGenerateTextWithPlaceholder() {
	const [content, setContent] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const contentBufferRef = useRef("");

	const metadata = usePdfReaderStore((state) => state.metadata);
	const { provides } = useScrollCapability();

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

	const generate = useCallback(
		async (params: GenerateTextParams) => {
			if (!provides) return;
			contentBufferRef.current = "";
			setContent("");
			setErrorMessage(null);
			setIsStreaming(true);

			const currentPage = provides.getCurrentPage();
			const outlineTitlePath = getOutlinePathStringByPageNumber(
				metadata?.outlines ?? [],
				currentPage,
			);

			const response = await generateTextWithPlaceholder({
				prompt: params.prompt,
				placeholderMap: {
					selected_text: params.selectedText,
					document_title: metadata?.title ?? "",
					outline_title: outlineTitlePath,
				},
				model: params.model,
			});

			if (!response.success) {
				setErrorMessage(response.errorMessage ?? "Failed to generate response");
				setIsStreaming(false);
			}
		},
		[metadata, provides],
	);

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
