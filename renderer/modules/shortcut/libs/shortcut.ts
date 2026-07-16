export function stringifyShortcutKeys(keys: string[]) {
	return keys.join("+");
}

export const MODIFIER_KEYS = ["ctrl", "alt", "shift", "meta"];

export const SPECIAL_KEYS = [
	"escape",
	"backspace",
	"delete",
	"arrowup",
	"arrowdown",
	"arrowleft",
	"arrowright",
	"tab",
	"=",
	"-",
	"+",
];

export const ALLOWED_KEYS = [...MODIFIER_KEYS, ...SPECIAL_KEYS];

/**
 * Get the shortcut keys from the keyboard event
 * This will return the shortcut keys in an array of strings.
 *
 * Example: `["ctrl", "alt", "k"]`
 */
export function getShortcutKeyFromEvent(event: KeyboardEvent): string[] | null {
	const keys: string[] = [];

	// Add modifiers
	if (event.ctrlKey) keys.push("ctrl");
	if (event.altKey) keys.push("alt");
	if (event.shiftKey) keys.push("shift");
	if (event.metaKey) keys.push("meta");

	// Add normal key
	const rawKey = event.key.toLowerCase();

	if (!MODIFIER_KEYS.includes(rawKey) && isKeyAllowed(rawKey)) {
		keys.push(rawKey);
	}

	if (keys.length === 0) return null;

	return keys;
}

/**
 * Check if the key is allowed for shortcuts
 * Following keys are allowed:
 * - Modifier keys: ctrl, alt, shift, meta
 * - Special keys: escape, backspace, delete, arrowup, arrowdown, arrowleft, arrowright, tab
 * - a-z
 * - 0-9
 */
export function isKeyAllowed(key: string): boolean {
	const normalized = key.toLowerCase();

	if (ALLOWED_KEYS.includes(normalized)) {
		return true;
	}

	// Whether is A-Z
	if (/^[a-z]$/.test(normalized)) {
		return true;
	}

	// Whether is 0-9
	if (/^[0-9]$/.test(normalized)) {
		return true;
	}

	return false;
}
