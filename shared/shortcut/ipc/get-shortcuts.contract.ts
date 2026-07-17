import type { ShortcutValues } from "../types/shortcut.type";

export const GET_SHORTCUTS_CHANNEL_NAME = "get-shortcuts";

export type GetShortcutsRequest = undefined;

export type GetShortcutsResponse = {
	shortcuts: ShortcutValues;
};
