import {
	isKeyAllowed,
	MODIFIER_KEYS,
} from "@renderer/modules/shortcut/libs/shortcut";
import { stringifyShortcutKeys } from "@shared/shortcut/utils/shortcut.util";

export function areShortcutKeysEqual(a: string[], b: string[]) {
	return stringifyShortcutKeys(a) === stringifyShortcutKeys(b);
}

export function isValidShortcutKeys(keys: string[]) {
	if (keys.length === 0) return false;
	if (keys.every((key) => MODIFIER_KEYS.includes(key))) return false;
	if (keys.every((key) => !isKeyAllowed(key))) return false;
	return true;
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
