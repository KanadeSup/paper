export type LlmModelOption = {
	value: string;
	label: string;
};

export const LLM_MODEL_OPTIONS: LlmModelOption[] = [
	{ value: "grok-4.3", label: "Grok 4.3" },
	{ value: "grok-3", label: "Grok 3" },
	{ value: "gpt-4o", label: "GPT-4o" },
	{ value: "gpt-4o-mini", label: "GPT-4o Mini" },
	{ value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
	{ value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
];

export const DEFAULT_LLM_MODEL = LLM_MODEL_OPTIONS[0].value;
