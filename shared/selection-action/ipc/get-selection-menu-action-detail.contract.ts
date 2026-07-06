import type { SelectionMenuAction } from "../types/selection-menu-action.type";

export const GET_SELECTION_MENU_ACTION_DETAIL_CHANNEL_NAME =
	"get-selection-menu-action-detail";

export type GetSelectionMenuActionDetailRequest = {
	actionId: string;
};

export type GetSelectionMenuActionDetailResponse = {
	action: SelectionMenuAction;
};
