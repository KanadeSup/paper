import {
	GeminiIcon,
	GrokIcon,
	OpenAIIcon,
} from "@renderer/modules/icon/components/brand-icon";
import type { IconProps } from "@renderer/modules/icon/types/icon.type";

export type ApiKeyProviderMeta = {
	id: string;
	name: string;
	description: string;
	placeholder: string;
	icon: (props: IconProps) => React.ReactNode;
};

export const API_KEY_PROVIDERS: ApiKeyProviderMeta[] = [
	{
		id: "grok",
		name: "Grok",
		description: "xAI models for chat and selection actions.",
		placeholder: "xai-...",
		icon: GrokIcon,
	},
	{
		id: "gemini",
		name: "Gemini",
		description: "Google Gemini models for chat and selection actions.",
		placeholder: "AIza...",
		icon: GeminiIcon,
	},
	{
		id: "openai",
		name: "OpenAI",
		description: "OpenAI models and embeddings for RAG.",
		placeholder: "sk-...",
		icon: OpenAIIcon,
	},
];
