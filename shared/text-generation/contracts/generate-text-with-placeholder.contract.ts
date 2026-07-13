export const GENERATE_TEXT_WITH_PLACEHOLDER_CHANNEL_NAME =
	"generate-text-with-placeholder";
export const GENERATE_TEXT_WITH_PLACEHOLDER_START_CHANNEL_NAME =
	"generate-text-with-placeholder-start";
export const GENERATE_TEXT_WITH_PLACEHOLDER_CHUNK_CHANNEL_NAME =
	"generate-text-with-placeholder-chunk";
export const GENERATE_TEXT_WITH_PLACEHOLDER_FINISH_CHANNEL_NAME =
	"generate-text-with-placeholder-finish";
export const GENERATE_TEXT_WITH_PLACEHOLDER_ERROR_CHANNEL_NAME =
	"generate-text-with-placeholder-error";

export type GenerateTextWithPlaceholderRequest = {
	prompt: string;
	placeholderMap: Record<string, string>;
	model: string;
};

export type GenerateTextWithPlaceholderResponse = null;

export type OnGenerateTextWithPlaceholderStartResponse = {
	resolvedPrompt: string;
};

export type OnGenerateTextWithPlaceholderChunkResponse = {
	chunk: string;
};

export type OnGenerateTextWithPlaceholderFinishResponse = {
	content: string;
};

export type OnGenerateTextWithPlaceholderErrorResponse = {
	errorMessage: string;
	errorCode?: string;
};
