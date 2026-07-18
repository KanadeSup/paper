import { SparklesIcon } from "lucide-react";

export const DEFAULT_ACTION_ICON = SparklesIcon;

export type MenuAction = {
	id: string;
	name: string;
	description: string;
	prompt: string;
	model: string;
	icon: React.ElementType;
	enabled: boolean;
};

export type MenuActionFormValues = {
	name: string;
	description: string;
	prompt: string;
	model: string;
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
		key: "{{outline_title}}",
		label: "Outline Title",
		description: "Title of the current outline",
	},
];
