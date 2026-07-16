import type { ShortcutName } from "@renderer/modules/shortcut/hooks/shortcut-store";
import {
	createDefaultShortcutValues,
	getShortcutDefinition,
	getShortcutsByGroup,
	SHORTCUT_GROUPS,
} from "@shared/shortcut/constants/shortcut.constant";
import type { ShortcutValues } from "@shared/shortcut/types/shortcut.type";
import { useCallback, useState } from "react";
import type { PendingShortcutChange } from "../types/shortcut-setting.type";
import { findShortcutConflict } from "../utils/shortcut-keys";

function persistShortcutChange(
	shortcutId: ShortcutName,
	keys: string[],
	allValues: ShortcutValues,
) {
	// Persistence will be wired to the main process later.
	console.log("[shortcut] save", {
		shortcutId,
		keys,
		allShortcuts: allValues,
	});
}

export function useShortcutSettings() {
	const [values, setValues] = useState<ShortcutValues>(
		createDefaultShortcutValues,
	);
	const [pendingChange, setPendingChange] =
		useState<PendingShortcutChange | null>(null);

	const applyChange = useCallback(
		(
			shortcutId: ShortcutName,
			keys: string[],
			clearConflictId?: ShortcutName,
		) => {
			setValues((current) => {
				const next: ShortcutValues = {
					...current,
					[shortcutId]: keys,
				};

				if (clearConflictId) {
					next[clearConflictId] = [];
				}

				persistShortcutChange(shortcutId, keys, next);
				return next;
			});
		},
		[],
	);

	const requestChange = useCallback(
		(shortcutId: ShortcutName, keys: string[]) => {
			const conflict = findShortcutConflict({
				shortcutId,
				keys,
				values,
			});

			if (conflict) {
				setPendingChange({ shortcutId, keys, conflict });
				return;
			}

			applyChange(shortcutId, keys);
		},
		[applyChange, values],
	);

	const resetShortcut = useCallback(
		(shortcutId: ShortcutName) => {
			const definition = getShortcutDefinition(shortcutId);
			if (!definition) return;
			requestChange(shortcutId, [...definition.defaultKeys]);
		},
		[requestChange],
	);

	const clearShortcut = useCallback(
		(shortcutId: ShortcutName) => {
			applyChange(shortcutId, []);
		},
		[applyChange],
	);

	const cancelPendingChange = useCallback(() => {
		setPendingChange(null);
	}, []);

	const confirmOverride = useCallback(() => {
		if (!pendingChange) return;

		applyChange(
			pendingChange.shortcutId,
			pendingChange.keys,
			pendingChange.conflict.shortcutId,
		);
		setPendingChange(null);
	}, [applyChange, pendingChange]);

	const groupedShortcuts = SHORTCUT_GROUPS.map((group) => ({
		group,
		shortcuts: getShortcutsByGroup(group.id).map((definition) => ({
			definition,
			keys: values[definition.id] ?? [],
		})),
	})).filter((entry) => entry.shortcuts.length > 0);

	return {
		groupedShortcuts,
		pendingChange,
		requestChange,
		resetShortcut,
		clearShortcut,
		cancelPendingChange,
		confirmOverride,
	};
}
