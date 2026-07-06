import { SparklesIcon } from "lucide-react";

export const DEFAULT_ACTION_ICON = SparklesIcon;

export type MenuAction = {
	id: string;
	name: string;
	description: string;
	prompt: string;
	icon: React.ElementType;
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
