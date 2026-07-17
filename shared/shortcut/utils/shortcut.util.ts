import { SHORTCUT_DEFINITIONS } from "../constants/shortcut.constant";
import type {
	ShortcutBinding,
	ShortcutDefinition,
	ShortcutGroupId,
	ShortcutId,
	ShortcutValues,
} from "../types/shortcut.type";

/**
 * Create a default shortcut values object.
 * Each shortcut id is assigned its default keys.
 */
export function createDefaultShortcutValues(): ShortcutValues {
	return SHORTCUT_DEFINITIONS.reduce((acc, definition) => {
		acc[definition.id] = [...definition.defaultKeys];
		return acc;
	}, {} as ShortcutValues);
}

/** Get all shortcuts by group. */
export function getShortcutsByGroup(groupId: ShortcutGroupId) {
	return SHORTCUT_DEFINITIONS.filter(
		(definition) => definition.group === groupId,
	);
}

/** Get a shortcut definition by id. */
export function getShortcutDefinition(id: ShortcutDefinition["id"]) {
	return SHORTCUT_DEFINITIONS.find((definition) => definition.id === id);
}

/**
 * Transforms an array of shortcut records into a complete ShortcutValues object.
 *
 * Behavior:
 * - Only shortcuts defined in the constants are included; unrecognized IDs are skipped.
 * - If a shortcut's key is null, it is treated as an empty shortcut (no keys assigned).
 * - Any shortcut defined in the constants but missing from the records will be added
 *   with its default keys.
 */
export function toShortcutValues(
	records: Array<{ id: string; key: string | null }>,
): ShortcutValues {
	const values = createDefaultShortcutValues();

	for (const record of records) {
		const shortcutId = toShortcutId(record.id);
		if (!shortcutId) continue;

		if (record.key == null) values[shortcutId] = [];
		else values[shortcutId] = parseShortcutKey(record.key);
	}

	return values;
}

/** Create an fully shortcuts array with empty keys. */
export function createEmptyShortcutValues(): ShortcutValues {
	return SHORTCUT_DEFINITIONS.reduce((acc, definition) => {
		acc[definition.id] = [];
		return acc;
	}, {} as ShortcutValues);
}

export type ShortcutKeyConflict = {
	shortcutId: ShortcutId;
	title: string;
	keys: string[];
};

/**
 * Find a shortcut key conflict.
 *
 * @param params - The parameters to find a shortcut key conflict.
 * @param params.shortcutId - The shortcut id of keys to check for conflict.
 * @param params.keys - The keys to check for conflict.
 * @param params.values - The values to find a conflict for.
 * @returns The shortcut key conflict if found, otherwise null.
 */
export function findShortcutKeyConflict(params: {
	shortcutId: ShortcutId;
	keys: string[];
	values: ShortcutValues;
}): ShortcutKeyConflict | null {
	const { shortcutId, keys, values } = params;

	if (keys.length === 0) return null;

	const definition = getShortcutDefinition(shortcutId);
	if (!definition) return null;

	const candidate = stringifyShortcutKeys(keys);

	for (const [id, assignedKeys] of Object.entries(values)) {
		const currentShortcutId = toShortcutId(id);
		if (!currentShortcutId) continue;

		if (currentShortcutId === shortcutId) continue;
		if (assignedKeys.length === 0) continue;

		const otherDefinition = getShortcutDefinition(currentShortcutId);
		if (!otherDefinition || otherDefinition.group !== definition.group) {
			continue;
		}

		if (stringifyShortcutKeys(assignedKeys) === candidate) {
			return {
				shortcutId: currentShortcutId,
				title: otherDefinition.title,
				keys: assignedKeys,
			};
		}
	}

	return null;
}

/** Stringify an array of shortcut keys. */
export function stringifyShortcutKeys(keys: string[]) {
	return normalizeShortcutKeyOrder(keys).join("+");
}

/** Parse a shortcut key string into an array of shortcut keys. */
export function parseShortcutKey(key: string): string[] {
	if (!key) return [];
	return normalizeShortcutKeyOrder(key.split("+").filter(Boolean));
}

export function normalizeShortcutKeyOrder(keys: string[]): string[] {
	// Sort modifiers (Ctrl > Shift > Alt > Meta)
	const modifierOrder = ["ctrl", "shift", "alt", "meta"];
	const sortedModifiers = keys
		.filter((key) => modifierOrder.includes(key.toLowerCase()))
		.sort(
			(a, b) =>
				modifierOrder.indexOf(a.toLowerCase()) -
				modifierOrder.indexOf(b.toLowerCase()),
		);

	const otherKeys = keys.filter(
		(key) => !modifierOrder.includes(key.toLowerCase()),
	);

	return [...sortedModifiers, ...otherKeys];
}

/** Convert a string to a ShortcutId. If the string is not a valid ShortcutId, return null. */
export function toShortcutId(id: string): ShortcutId | null {
	return (
		SHORTCUT_DEFINITIONS.find((definition) => definition.id === id)?.id ?? null
	);
}

export function toShortcutBindings(values: ShortcutValues): ShortcutBinding[] {
	const bindings: ShortcutBinding[] = [];
	for (const [id, keys] of Object.entries(values)) {
		const shortcutId = toShortcutId(id);
		if (!shortcutId) continue;

		const definition = getShortcutDefinition(shortcutId);
		if (!definition) continue;

		bindings.push({ id: shortcutId, keys, group: definition.group });
	}
	return bindings;
}
