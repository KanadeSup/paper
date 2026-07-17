import type { ShortcutId } from "../types/shortcut.type";

export const DELETE_SHORTCUT_CHANNEL_NAME = "delete-shortcut";

export type DeleteShortcutRequest = {
	shortcutId: ShortcutId;
};

export type DeleteShortcutResponse = null;
