import type { SystemPlaceholder } from "../types/menu-action.type";

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
