import { useEffect } from "react";
import { create } from "zustand";

export type ShortcutName =
	| "pdf-reader.toggle-sidebar"
	| "pdfreader.toggle-pdf-chat"
	| "pdfreader.increase-zoom"
	| "pdfreader.decrease-zoom"
	| "pdfreader.scroll-up"
	| "pdfreader.scroll-down";

export type ShortcutHandler = {
	shortcutType: ShortcutName;
	handler: () => void;
};

export type ShortcutStore = {
	handlers: ShortcutHandler[];
	actions: {
		register: (handler: ShortcutHandler) => void;
		unregister: (shortcutType: ShortcutName) => void;
	};
};

const shortcutStore = create<ShortcutStore>((set) => ({
	handlers: [],
	actions: {
		register: (registerHandler: ShortcutHandler) =>
			set((state) => {
				const matchedHandlers = state.handlers.find(
					(handler) => handler.shortcutType === registerHandler.shortcutType,
				);
				if (matchedHandlers) {
					console.warn(
						`Handler with id ${registerHandler.shortcutType} already registered. So it will be overridden.`,
					);
					return { handlers: state.handlers };
				}
				return { handlers: [...state.handlers, registerHandler] };
			}),
		unregister: (shortcutType: ShortcutName) =>
			set((state) => ({
				handlers: state.handlers.filter(
					(handler) => handler.shortcutType !== shortcutType,
				),
			})),
	},
}));

export const useRegisterShortcut = (
	shortcutType: ShortcutName,
	handler: () => void,
) => {
	const actions = useShortcutActions();
	useEffect(() => {
		actions.register({ shortcutType, handler });
		return () => {
			actions.unregister(shortcutType);
		};
	}, [shortcutType, handler, actions]);
};

export const useRegisteredShortcuts = () => {
	return shortcutStore((state) => state.handlers);
};

export const useShortcutActions = () => {
	return shortcutStore((state) => state.actions);
};
