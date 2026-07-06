import { invoke } from "@renderer/modules/design-system/ipc/base.ipc";
import {
	DELETE_SELECTION_MENU_ACTION_CHANNEL_NAME,
	type DeleteSelectionMenuActionRequest,
	type DeleteSelectionMenuActionResponse,
} from "@shared/selection-action/ipc/delete-selection-menu-action.contract";
import {
	GET_SELECTION_MENU_ACTION_DETAIL_CHANNEL_NAME,
	type GetSelectionMenuActionDetailRequest,
	type GetSelectionMenuActionDetailResponse,
} from "@shared/selection-action/ipc/get-selection-menu-action-detail.contract";
import {
	GET_SELECTION_MENU_ACTION_LIST_CHANNEL_NAME,
	type GetSelectionMenuActionListResponse,
} from "@shared/selection-action/ipc/get-selection-menu-action-list.contract";
import {
	UPDATE_SELECTION_MENU_ACTION_CHANNEL_NAME,
	type UpdateSelectionMenuActionRequest,
	type UpdateSelectionMenuActionResponse,
} from "@shared/selection-action/ipc/update-selection-menu-action.contract";

export function getSelectionMenuActionList() {
	return invoke<undefined, GetSelectionMenuActionListResponse>(
		GET_SELECTION_MENU_ACTION_LIST_CHANNEL_NAME,
		undefined,
	);
}

export function getSelectionMenuActionDetail(actionId: string) {
	return invoke<
		GetSelectionMenuActionDetailRequest,
		GetSelectionMenuActionDetailResponse
	>(GET_SELECTION_MENU_ACTION_DETAIL_CHANNEL_NAME, { actionId });
}

export function updateSelectionMenuAction(
	request: UpdateSelectionMenuActionRequest,
) {
	return invoke<
		UpdateSelectionMenuActionRequest,
		UpdateSelectionMenuActionResponse
	>(UPDATE_SELECTION_MENU_ACTION_CHANNEL_NAME, request);
}

export function deleteSelectionMenuAction(actionId: string) {
	return invoke<
		DeleteSelectionMenuActionRequest,
		DeleteSelectionMenuActionResponse
	>(DELETE_SELECTION_MENU_ACTION_CHANNEL_NAME, { actionId });
}
