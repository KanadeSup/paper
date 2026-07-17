import { SHORTCUT_GROUPS } from "@shared/shortcut/constants/shortcut.constant";
import type {
	ShortcutId,
	ShortcutValues,
} from "@shared/shortcut/types/shortcut.type";
import {
	createDefaultShortcutValues,
	findShortcutKeyConflict,
	getShortcutDefinition,
	getShortcutsByGroup,
	stringifyShortcutKeys,
} from "@shared/shortcut/utils/shortcut.util";
import { useCallback, useEffect, useState } from "react";
import { deleteShortcut, getShortcuts, setShortcut } from "../ipc/shortcut.ipc";
import type { PendingShortcutChange } from "../types/shortcut-setting.type";

export function useShortcutSettings() {
	const [values, setValues] = useState<ShortcutValues>(
		createDefaultShortcutValues,
	);
	const [isInitializing, setIsInitializing] = useState(true);
	const [pendingChange, setPendingChange] =
		useState<PendingShortcutChange | null>(null);

	useEffect(() => {
		const response = getShortcuts();
		response
			.then((response) => {
				if (!response.success) return;
				setValues(response.data.shortcuts);
			})
			.finally(() => {
				setIsInitializing(false);
			});
	}, []);

	const applyChange = useCallback(
		async (shortcutId: ShortcutId, keys: string[]) => {
			let isSuccess = false;

			if (keys.length === 0) {
				// If the keys are empty, delete the shortcut
				const response = await deleteShortcut({ shortcutId });
				isSuccess = response.success;
			} else {
				// If the keys are not empty, set the shortcut
				const response = await setShortcut({
					shortcutId,
					key: stringifyShortcutKeys(keys),
				});
				isSuccess = response.success;
			}

			if (!isSuccess) return false;

			setValues((current) => ({
				...current,
				[shortcutId]: keys,
			}));

			return true;
		},
		[],
	);

	/** If the key is empty, delete the shortcut. Otherwise, set the shortcut. */
	const requestChange = useCallback(
		(shortcutId: ShortcutId, keys: string[]) => {
			const conflict = findShortcutKeyConflict({
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
		(shortcutId: ShortcutId) => {
			const definition = getShortcutDefinition(shortcutId);
			if (!definition) return;
			requestChange(shortcutId, [...definition.defaultKeys]);
		},
		[requestChange],
	);

	const clearShortcut = useCallback(
		(shortcutId: ShortcutId) => {
			void applyChange(shortcutId, []);
		},
		[applyChange],
	);

	const cancelPendingChange = useCallback(() => {
		setPendingChange(null);
	}, []);

	const confirmOverride = useCallback(async () => {
		if (!pendingChange) return;

		const { shortcutId, keys, conflict } = pendingChange;
		setPendingChange(null);

		// Delete the conflicting shortcut before setting the new shortcut
		const deleted = await applyChange(conflict.shortcutId, []);
		if (!deleted) return;

		// Set the new shortcut
		await applyChange(shortcutId, keys);
	}, [applyChange, pendingChange]);

	const groupedShortcuts = SHORTCUT_GROUPS.map((group) => ({
		group,
		shortcuts: getShortcutsByGroup(group.id).map((definition) => ({
			definition,
			keys: values[definition.id] ?? [],
		})),
	})).filter((entry) => entry.shortcuts.length > 0);

	return {
		isInitializing,
		groupedShortcuts,
		pendingChange,
		requestChange,
		resetShortcut,
		clearShortcut,
		cancelPendingChange,
		confirmOverride,
	};
}
