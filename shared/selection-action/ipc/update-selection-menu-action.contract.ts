import type { SelectionMenuAction } from "../types/selection-menu-action.type";

export const UPDATE_SELECTION_MENU_ACTION_CHANNEL_NAME =
	"update-selection-menu-action";

export type UpdateSelectionMenuActionRequest = {
	actionId: string;
	action: Partial<
		Pick<
			SelectionMenuAction,
			"name" | "description" | "promptWithPlaceholder" | "order"
		>
	>;
};

export type UpdateSelectionMenuActionResponse = {
	action: SelectionMenuAction;
};
