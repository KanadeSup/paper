export type ShortcutId =
	| "global.toggle-app-sidebar"
	| "pdf-reader.toggle-sidebar"
	| "pdf-reader.toggle-pdf-chat"
	| "pdf-reader.increase-zoom"
	| "pdf-reader.decrease-zoom"
	| "pdf-reader.scroll-up"
	| "pdf-reader.scroll-down";

export type ShortcutGroupId = "global" | "pdf-reader";

export type ShortcutGroupMeta = {
	id: ShortcutGroupId;
	label: string;
	description: string;
};

export type ShortcutDefinition = {
	id: ShortcutId;
	group: ShortcutGroupId;
	title: string;
	description: string;
	defaultKeys: string[];
};

export type ShortcutValues = Record<ShortcutId, string[]>;

export type ShortcutBinding = {
	id: ShortcutId;
	keys: string[];
	group: ShortcutGroupId;
};
