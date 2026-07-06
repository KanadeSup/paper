import {
	CopyIcon,
	GlobeIcon,
	HighlighterIcon,
	Languages,
	Wand2Icon,
} from "lucide-react";

export type MenuAction = {
	id: string;
	name: string;
	description: string;
	prompt: string;
	icon: React.ElementType;
	createdAt: Date;
	enabled: boolean;
};

export type MenuActionFormValues = {
	name: string;
	description: string;
	prompt: string;
};

export type SystemPlaceholder = {
	key: string;
	label: string;
	description: string;
};

export const SYSTEM_PLACEHOLDERS: SystemPlaceholder[] = [
	{
		key: "{{selected_text}}",
		label: "Selected Text",
		description: "The text the user highlighted",
	},
	{
		key: "{{document_title}}",
		label: "Document Title",
		description: "Title of the current PDF",
	},
	{
		key: "{{page_number}}",
		label: "Page Number",
		description: "Current page number",
	},
	{
		key: "{{author}}",
		label: "Author",
		description: "Document author",
	},
];

export const INITIAL_ACTIONS: MenuAction[] = [
	{
		id: "1",
		name: "Copy Text",
		description: "Copy the selected text to clipboard instantly",
		prompt: "",
		icon: CopyIcon,
		createdAt: new Date("2024-01-10"),
		enabled: true,
	},
	{
		id: "2",
		name: "Summarize",
		description: "Summarize the selected passage using AI",
		prompt:
			"Summarize the following excerpt from '{{document_title}}' (page {{page_number}}) in 2–3 concise sentences:\n\n{{selected_text}}",
		icon: Wand2Icon,
		createdAt: new Date("2024-01-15"),
		enabled: true,
	},
	{
		id: "3",
		name: "Translate",
		description: "Translate the selected text to your preferred language",
		prompt:
			"Translate the following text to English. Keep the original meaning and tone:\n\n{{selected_text}}",
		icon: Languages,
		createdAt: new Date("2024-02-01"),
		enabled: false,
	},
	{
		id: "4",
		name: "Search Web",
		description: "Open a web search for the selected text",
		prompt: "",
		icon: GlobeIcon,
		createdAt: new Date("2024-02-20"),
		enabled: true,
	},
	{
		id: "5",
		name: "Highlight",
		description: "Add a color highlight annotation to the selected text",
		prompt: "",
		icon: HighlighterIcon,
		createdAt: new Date("2024-03-05"),
		enabled: false,
	},
];
