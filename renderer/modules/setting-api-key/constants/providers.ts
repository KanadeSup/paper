import type { LucideIcon } from "lucide-react";
import { SparklesIcon, WandSparklesIcon, ZapIcon } from "lucide-react";

export type ApiKeyProviderMeta = {
	id: string;
	name: string;
	description: string;
	placeholder: string;
	icon: LucideIcon;
};

export const API_KEY_PROVIDERS: ApiKeyProviderMeta[] = [
	{
		id: "grok",
		name: "Grok",
		description: "xAI models for chat and selection actions.",
		placeholder: "xai-...",
		icon: ZapIcon,
	},
	{
		id: "gemini",
		name: "Gemini",
		description: "Google Gemini models for chat and selection actions.",
		placeholder: "AIza...",
		icon: SparklesIcon,
	},
	{
		id: "openai",
		name: "OpenAI",
		description: "OpenAI models and embeddings for RAG.",
		placeholder: "sk-...",
		icon: WandSparklesIcon,
	},
];
