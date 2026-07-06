import type { SelectionMenuAction } from "../types/selection-menu-action.type";

export const GET_SELECTION_MENU_ACTION_LIST_CHANNEL_NAME =
	"get-selection-menu-action-list";

export type GetSelectionMenuActionListRequest = undefined;

export type GetSelectionMenuActionListResponse = {
	actions: SelectionMenuAction[];
};
