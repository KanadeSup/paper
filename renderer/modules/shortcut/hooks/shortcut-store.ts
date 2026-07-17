import type { ShortcutId } from "@shared/shortcut/types/shortcut.type";
import { useEffect } from "react";
import { create } from "zustand";

export type { ShortcutId as ShortcutName };

export type ShortcutHandler = {
	shortcutId: ShortcutId;
	handler: (event: KeyboardEvent) => void;
};

export type ShortcutStore = {
	handlers: ShortcutHandler[];
	actions: {
		register: (handler: ShortcutHandler) => void;
		unregister: (shortcutType: ShortcutId) => void;
	};
};

const shortcutStore = create<ShortcutStore>((set) => ({
	handlers: [],
	actions: {
		register: (registerHandler: ShortcutHandler) =>
			set((state) => {
				const matchedHandlers = state.handlers.find(
					(handler) => handler.shortcutId === registerHandler.shortcutId,
				);
				if (matchedHandlers) {
					console.warn(
						`Handler with id ${registerHandler.shortcutId} already registered. So it will be overridden.`,
					);
					return { handlers: state.handlers };
				}
				return { handlers: [...state.handlers, registerHandler] };
			}),
		unregister: (shortcutType: ShortcutId) =>
			set((state) => ({
				handlers: state.handlers.filter(
					(handler) => handler.shortcutId !== shortcutType,
				),
			})),
	},
}));

export const useRegisterShortcut = (
	shortcutType: ShortcutId,
	handler: (event: KeyboardEvent) => void,
) => {
	const actions = useShortcutActions();
	useEffect(() => {
		actions.register({ shortcutId: shortcutType, handler });
		return () => {
			actions.unregister(shortcutType);
		};
	}, [shortcutType, actions, handler]);
};

export const useRegisteredShortcuts = () => {
	return shortcutStore((state) => state.handlers);
};

export const useShortcutActions = () => {
	return shortcutStore((state) => state.actions);
};
