import type { ShortcutGroupId } from "@shared/shortcut/types/shortcut.type";
import { stringifyShortcutKeys } from "@shared/shortcut/utils/shortcut.util";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { createStore, type StoreApi } from "zustand";
import { useShortcutBindings } from "../hooks/shortcut-keys-store";
import { useRegisteredShortcuts } from "../hooks/shortcut-store";
import { getShortcutKeyFromEvent } from "../libs/shortcut";

export type ActiveShortcutGroupStore = {
	activeShortcutGroups: ShortcutGroupId[];
	subscribeShortcutGroup: (groupId: ShortcutGroupId) => void;
	unsubscribeShortcutGroup: (groupId: ShortcutGroupId) => void;
};

const context = createContext<StoreApi<ActiveShortcutGroupStore> | null>(null);

export function ShortcutProvider({ children }: { children: React.ReactNode }) {
	// Create a store to manage the active shortcut groups
	const [store] = useState(() =>
		createStore<ActiveShortcutGroupStore>((set, get) => ({
			activeShortcutGroups: [],
			subscribeShortcutGroup: (groupId) => {
				const { activeShortcutGroups } = get();
				set({ activeShortcutGroups: [...activeShortcutGroups, groupId] });
			},
			unsubscribeShortcutGroup: (groupId) =>
				set((state) => {
					const foundIndex = state.activeShortcutGroups.indexOf(groupId);
					return {
						activeShortcutGroups: state.activeShortcutGroups.filter(
							(_, index) => index !== foundIndex,
						),
					};
				}),
		})),
	);

	const registeredShortcuts = useRegisteredShortcuts();
	const { activeShortcutGroups } = store.getState();
	const { shortcutBindings } = useShortcutBindings();

	const handleShortcut = useCallback(
		(event: KeyboardEvent) => {
			if (!shortcutBindings) return;

			const pressedKeys = getShortcutKeyFromEvent(event);
			if (!pressedKeys) return;

			console.log(activeShortcutGroups);

			// Filter the shortcut bindings by the active shortcut groups
			const filteredShortcutBindings = shortcutBindings.filter((shortcut) =>
				activeShortcutGroups.includes(shortcut.group),
			);

			// Find the shortcut that matches the pressed keys
			const shortcutKeysString = stringifyShortcutKeys(pressedKeys);
			const triggerShortcut = filteredShortcutBindings.find(
				(shortcut) =>
					stringifyShortcutKeys(shortcut.keys) === shortcutKeysString,
			);
			if (!triggerShortcut) return;

			// Get the handler for the shortcut
			const triggerShortcutHandler = registeredShortcuts.find(
				(shortcut) => shortcut.shortcutId === triggerShortcut.id,
			);
			if (!triggerShortcutHandler) return;

			// Execute the handler
			triggerShortcutHandler.handler(event);

			// Prevent the default browser behavior
			event.preventDefault();
			event.stopPropagation();
		},
		[registeredShortcuts, shortcutBindings, activeShortcutGroups],
	);

	useEffect(() => {
		window.addEventListener("keydown", handleShortcut);
		return () => {
			window.removeEventListener("keydown", handleShortcut);
		};
	}, [handleShortcut]);
	return <context.Provider value={store}>{children}</context.Provider>;
}

/**
 * Activates the specified shortcut group for the duration of the component's lifecycle.
 * - If invoked multiple times with different groupIds, all shortcut groups will be active concurrently.
 * - The shortcut group will be deactivated when all subscription components are unmounted.
 */
export function useSubcribeShortcutGroup(groupId: ShortcutGroupId) {
	const store = useContext(context);
	if (!store) {
		throw new Error(
			"useActiveShortcutGroup must be used within a ShortcutProvider",
		);
	}

	const { subscribeShortcutGroup, unsubscribeShortcutGroup } = store.getState();

	useEffect(() => {
		subscribeShortcutGroup(groupId);
		return () => unsubscribeShortcutGroup(groupId);
	}, [groupId, subscribeShortcutGroup, unsubscribeShortcutGroup]);

	return null;
}
