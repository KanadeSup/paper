import { getSelectionMenuActionList } from "@renderer/modules/setting-menu-selection/ipc/selection-action.ipc";
import type { MenuAction } from "@renderer/modules/setting-menu-selection/types/menu-action.type";
import { toMenuAction } from "@renderer/modules/setting-menu-selection/utils/menu-action.mapper";
import { useCallback, useEffect, useState } from "react";

export function useSelectionMenuActions() {
	const [actions, setActions] = useState<MenuAction[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchActions = useCallback(async () => {
		setIsLoading(true);

		const response = await getSelectionMenuActionList();

		if (!response.success) {
			setActions([]);
			setIsLoading(false);
			return;
		}

		setActions(
			response.data.actions
				.map(toMenuAction)
				.filter((action) => action.enabled),
		);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchActions();
	}, [fetchActions]);

	return {
		actions,
		isLoading,
		refresh: fetchActions,
	};
}
