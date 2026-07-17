import type { ShortcutId } from "../types/shortcut.type";

export const SET_SHORTCUT_CHANNEL_NAME = "set-shortcut";

export type SetShortcutRequest = {
	shortcutId: ShortcutId;
	/** Serialized shortcut binding, e.g. `"ctrl+shift+b"`. */
	key: string;
};

export type SetShortcutResponse = null;
