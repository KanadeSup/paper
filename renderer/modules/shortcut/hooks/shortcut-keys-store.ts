import { getShortcuts } from "@renderer/modules/setting-shortcut/ipc/shortcut.ipc";
import type { ShortcutBinding } from "@shared/shortcut/types/shortcut.type";
import { toShortcutBindings } from "@shared/shortcut/utils/shortcut.util";
import { useEffect, useState } from "react";

export function useShortcutBindings() {
	const [shortcutBindings, setShortcutBindings] = useState<ShortcutBinding[]>();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const response = getShortcuts();
		response
			.then((response) => {
				if (!response.success) {
					setError(response.errorMessage ?? "Failed to get shortcuts");
					return;
				}

				const shortcutBindings = toShortcutBindings(response.data.shortcuts);

				setShortcutBindings(shortcutBindings);
			})
			.catch((error) => {
				setError(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	return { shortcutBindings, isLoading, error };
}
