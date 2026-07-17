import { invoke } from "@renderer/modules/design-system/ipc/base.ipc";
import {
	DELETE_SHORTCUT_CHANNEL_NAME,
	type DeleteShortcutRequest,
	type DeleteShortcutResponse,
} from "@shared/shortcut/ipc/delete-shortcut.contract";
import {
	GET_SHORTCUTS_CHANNEL_NAME,
	type GetShortcutsResponse,
} from "@shared/shortcut/ipc/get-shortcuts.contract";
import {
	SET_SHORTCUT_CHANNEL_NAME,
	type SetShortcutRequest,
	type SetShortcutResponse,
} from "@shared/shortcut/ipc/set-shortcut.contract";

export function getShortcuts() {
	return invoke<undefined, GetShortcutsResponse>(
		GET_SHORTCUTS_CHANNEL_NAME,
		undefined,
	);
}

export function setShortcut(request: SetShortcutRequest) {
	return invoke<SetShortcutRequest, SetShortcutResponse>(
		SET_SHORTCUT_CHANNEL_NAME,
		request,
	);
}

export function deleteShortcut(request: DeleteShortcutRequest) {
	return invoke<DeleteShortcutRequest, DeleteShortcutResponse>(
		DELETE_SHORTCUT_CHANNEL_NAME,
		request,
	);
}
