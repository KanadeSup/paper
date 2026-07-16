import type { ShortcutName } from "@renderer/modules/shortcut/hooks/shortcut-store";

export type ShortcutConflict = {
	shortcutId: ShortcutName;
	title: string;
	keys: string[];
};

export type PendingShortcutChange = {
	shortcutId: ShortcutName;
	keys: string[];
	conflict: ShortcutConflict;
};
