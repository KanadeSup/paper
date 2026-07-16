import { useCallback, useEffect, useMemo } from "react";
import { useRegisteredShortcuts } from "../hooks/shortcut-store";
import {
	getShortcutKeyFromEvent,
	stringifyShortcutKeys,
} from "../libs/shortcut";

export function ShortcutProvider({ children }: { children: React.ReactNode }) {
	const registeredShortcuts = useRegisteredShortcuts();
	const configShortcuts = useMemo(
		() => [
			{ keys: ["ctrl", "b"], type: "pdf-reader.toggle-sidebar" },
			{ keys: ["j"], type: "pdf-reader.scroll-down" },
			{ keys: ["k"], type: "pdf-reader.scroll-up" },
		],
		[],
	);
	const handleShortcut = useCallback(
		(event: KeyboardEvent) => {
			const shortcutKeys = getShortcutKeyFromEvent(event);
			if (!shortcutKeys) return;
			const shortcutKeysString = stringifyShortcutKeys(shortcutKeys);
			const triggerShortcut = configShortcuts.find(
				(shortcut) =>
					stringifyShortcutKeys(shortcut.keys) === shortcutKeysString,
			);
			if (!triggerShortcut) return;
			const triggerShortcutType = triggerShortcut.type;
			const triggerShortcutHandler = registeredShortcuts.find(
				(shortcut) => shortcut.shortcutType === triggerShortcutType,
			);
			if (!triggerShortcutHandler) return;
			triggerShortcutHandler.handler(event);
			event.preventDefault();
			event.stopPropagation();
		},
		[registeredShortcuts, configShortcuts],
	);

	useEffect(() => {
		window.addEventListener("keydown", handleShortcut);
		return () => {
			window.removeEventListener("keydown", handleShortcut);
		};
	}, [handleShortcut]);
	return children;
}
