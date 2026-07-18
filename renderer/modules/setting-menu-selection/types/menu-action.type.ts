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
