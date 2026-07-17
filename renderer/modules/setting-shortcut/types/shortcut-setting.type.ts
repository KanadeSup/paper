import type { ShortcutId } from "@shared/shortcut/types/shortcut.type";

export type ShortcutConflict = {
	shortcutId: ShortcutId;
	title: string;
	keys: string[];
};

export type PendingShortcutChange = {
	shortcutId: ShortcutId;
	keys: string[];
	conflict: ShortcutConflict;
};
