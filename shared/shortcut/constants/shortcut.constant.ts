import type {
	ShortcutDefinition,
	ShortcutGroupId,
	ShortcutGroupMeta,
	ShortcutValues,
} from "../types/shortcut.type";

export const SHORTCUT_GROUPS: ShortcutGroupMeta[] = [
	{
		id: "global",
		label: "Global",
		description: "Shortcuts available across the entire app",
	},
	{
		id: "pdf-reader",
		label: "Pdf reader",
		description: "Shortcuts while reading a PDF",
	},
];

export const SHORTCUT_DEFINITIONS: ShortcutDefinition[] = [
	{
		id: "global.toggle-app-sidebar",
		group: "global",
		title: "Toggle app sidebar",
		description: "Show or hide the main application sidebar",
		defaultKeys: ["ctrl", "shift", "b"],
	},
	{
		id: "pdf-reader.toggle-sidebar",
		group: "pdf-reader",
		title: "Toggle sidebar",
		description: "Show or hide the PDF outline sidebar",
		defaultKeys: ["ctrl", "b"],
	},
	{
		id: "pdfreader.toggle-pdf-chat",
		group: "pdf-reader",
		title: "Toggle chat",
		description: "Show or hide the PDF chat panel",
		defaultKeys: ["ctrl", "l"],
	},
	{
		id: "pdf-reader.increase-zoom",
		group: "pdf-reader",
		title: "Zoom in",
		description: "Increase the document zoom level",
		defaultKeys: ["ctrl", "="],
	},
	{
		id: "pdf-reader.decrease-zoom",
		group: "pdf-reader",
		title: "Zoom out",
		description: "Decrease the document zoom level",
		defaultKeys: ["ctrl", "-"],
	},
	{
		id: "pdf-reader.scroll-up",
		group: "pdf-reader",
		title: "Scroll up",
		description: "Smoothly scroll the document upward",
		defaultKeys: ["k"],
	},
	{
		id: "pdf-reader.scroll-down",
		group: "pdf-reader",
		title: "Scroll down",
		description: "Smoothly scroll the document downward",
		defaultKeys: ["j"],
	},
];

export function createDefaultShortcutValues(): ShortcutValues {
	return SHORTCUT_DEFINITIONS.reduce((acc, definition) => {
		acc[definition.id] = [...definition.defaultKeys];
		return acc;
	}, {} as ShortcutValues);
}

export function getShortcutsByGroup(groupId: ShortcutGroupId) {
	return SHORTCUT_DEFINITIONS.filter(
		(definition) => definition.group === groupId,
	);
}

export function getShortcutDefinition(id: ShortcutDefinition["id"]) {
	return SHORTCUT_DEFINITIONS.find((definition) => definition.id === id);
}
