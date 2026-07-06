import type { SelectionMenuAction } from "../types/selection-menu-action.type";

export const CREATE_SELECTION_MENU_ACTION_CHANNEL_NAME =
	"create-selection-menu-action";

export type CreateSelectionMenuActionRequest = {
	name: string;
	description: string;
	promptWithPlaceholder: string;
	model: string;
};

export type CreateSelectionMenuActionResponse = {
	action: SelectionMenuAction;
};
