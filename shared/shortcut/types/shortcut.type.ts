import type { ShortcutName } from "@renderer/modules/shortcut/hooks/shortcut-store";

export type ShortcutGroupId = "global" | "pdf-reader";

export type ShortcutGroupMeta = {
	id: ShortcutGroupId;
	label: string;
	description: string;
};

export type ShortcutDefinition = {
	id: ShortcutName;
	group: ShortcutGroupId;
	title: string;
	description: string;
	defaultKeys: string[];
};

export type ShortcutValues = Record<ShortcutName, string[]>;
