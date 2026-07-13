import { invoke, onIpc } from "@renderer/modules/design-system/ipc/base.ipc";
import {
	GENERATE_TEXT_WITH_PLACEHOLDER_CHANNEL_NAME,
	GENERATE_TEXT_WITH_PLACEHOLDER_CHUNK_CHANNEL_NAME,
	GENERATE_TEXT_WITH_PLACEHOLDER_ERROR_CHANNEL_NAME,
	GENERATE_TEXT_WITH_PLACEHOLDER_FINISH_CHANNEL_NAME,
	GENERATE_TEXT_WITH_PLACEHOLDER_START_CHANNEL_NAME,
	type GenerateTextWithPlaceholderRequest,
	type GenerateTextWithPlaceholderResponse,
	type OnGenerateTextWithPlaceholderChunkResponse,
	type OnGenerateTextWithPlaceholderErrorResponse,
	type OnGenerateTextWithPlaceholderFinishResponse,
	type OnGenerateTextWithPlaceholderStartResponse,
} from "@shared/text-generation/contracts/generate-text-with-placeholder.contract";

export function generateTextWithPlaceholder(
	request: GenerateTextWithPlaceholderRequest,
) {
	return invoke<
		GenerateTextWithPlaceholderRequest,
		GenerateTextWithPlaceholderResponse
	>(GENERATE_TEXT_WITH_PLACEHOLDER_CHANNEL_NAME, request);
}

export function onGenerateTextWithPlaceholderStart(
	listener: (response: OnGenerateTextWithPlaceholderStartResponse) => void,
) {
	onIpc<OnGenerateTextWithPlaceholderStartResponse>(
		GENERATE_TEXT_WITH_PLACEHOLDER_START_CHANNEL_NAME,
		(_, response) => listener(response),
	);
	return () => {
		window.electron.ipcRenderer.removeAllListeners(
			GENERATE_TEXT_WITH_PLACEHOLDER_START_CHANNEL_NAME,
		);
	};
}

export function onGenerateTextWithPlaceholderChunk(
	listener: (response: OnGenerateTextWithPlaceholderChunkResponse) => void,
) {
	onIpc<OnGenerateTextWithPlaceholderChunkResponse>(
		GENERATE_TEXT_WITH_PLACEHOLDER_CHUNK_CHANNEL_NAME,
		(_, response) => listener(response),
	);
	return () => {
		window.electron.ipcRenderer.removeAllListeners(
			GENERATE_TEXT_WITH_PLACEHOLDER_CHUNK_CHANNEL_NAME,
		);
	};
}

export function onGenerateTextWithPlaceholderFinish(
	listener: (response: OnGenerateTextWithPlaceholderFinishResponse) => void,
) {
	onIpc<OnGenerateTextWithPlaceholderFinishResponse>(
		GENERATE_TEXT_WITH_PLACEHOLDER_FINISH_CHANNEL_NAME,
		(_, response) => listener(response),
	);
	return () => {
		window.electron.ipcRenderer.removeAllListeners(
			GENERATE_TEXT_WITH_PLACEHOLDER_FINISH_CHANNEL_NAME,
		);
	};
}

export function onGenerateTextWithPlaceholderError(
	listener: (response: OnGenerateTextWithPlaceholderErrorResponse) => void,
) {
	onIpc<OnGenerateTextWithPlaceholderErrorResponse>(
		GENERATE_TEXT_WITH_PLACEHOLDER_ERROR_CHANNEL_NAME,
		(_, response) => listener(response),
	);
	return () => {
		window.electron.ipcRenderer.removeAllListeners(
			GENERATE_TEXT_WITH_PLACEHOLDER_ERROR_CHANNEL_NAME,
		);
	};
}
