import type { ShortcutName } from "@renderer/modules/shortcut/hooks/shortcut-store";
import {
	isKeyAllowed,
	MODIFIER_KEYS,
	stringifyShortcutKeys,
} from "@renderer/modules/shortcut/libs/shortcut";
import { getShortcutDefinition } from "@shared/shortcut/constants/shortcut.constant";
import type { ShortcutValues } from "@shared/shortcut/types/shortcut.type";
import type { ShortcutConflict } from "../types/shortcut-setting.type";

export function areShortcutKeysEqual(a: string[], b: string[]) {
	return stringifyShortcutKeys(a) === stringifyShortcutKeys(b);
}

export function isValidShortcutKeys(keys: string[]) {
	if (keys.length === 0) return false;
	if (keys.every((key) => MODIFIER_KEYS.includes(key))) return false;
	if (keys.every((key) => !isKeyAllowed(key))) return false;
	return true;
}

export function findShortcutConflict(params: {
	shortcutId: ShortcutName;
	keys: string[];
	values: ShortcutValues;
}): ShortcutConflict | null {
	const { shortcutId, keys, values } = params;

	if (keys.length === 0) return null;

	const definition = getShortcutDefinition(shortcutId);
	if (!definition) return null;

	const candidate = stringifyShortcutKeys(keys);

	for (const [id, assignedKeys] of Object.entries(values) as [
		ShortcutName,
		string[],
	][]) {
		if (id === shortcutId) continue;
		if (assignedKeys.length === 0) continue;

		const otherDefinition = getShortcutDefinition(id);
		if (!otherDefinition || otherDefinition.group !== definition.group) {
			continue;
		}

		if (stringifyShortcutKeys(assignedKeys) === candidate) {
			return {
				shortcutId: id,
				title: otherDefinition.title,
				keys: assignedKeys,
			};
		}
	}

	return null;
}

const KEY_LABELS: Record<string, string> = {
	ctrl: "Ctrl",
	alt: "Alt",
	shift: "Shift",
	meta: "Meta",
	escape: "Esc",
	backspace: "Backspace",
	delete: "Delete",
	arrowup: "↑",
	arrowdown: "↓",
	arrowleft: "←",
	arrowright: "→",
	tab: "Tab",
	"=": "=",
	"-": "-",
};

export function formatShortcutKeyLabel(key: string) {
	const normalized = key.toLowerCase();
	if (KEY_LABELS[normalized]) return KEY_LABELS[normalized];
	if (/^[a-z]$/.test(normalized)) return normalized.toUpperCase();
	return key;
}

export function formatShortcutKeysLabel(keys: string[]) {
	if (keys.length === 0) return null;
	return keys.map(formatShortcutKeyLabel).join(" + ");
}
