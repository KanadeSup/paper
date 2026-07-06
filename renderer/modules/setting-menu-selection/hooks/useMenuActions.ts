import type { SelectionMenuAction } from "@shared/selection-action/types/selection-menu-action.type";
import { useCallback, useEffect, useState } from "react";
import {
	deleteSelectionMenuAction,
	getSelectionMenuActionList,
	updateSelectionMenuAction,
} from "../ipc/selection-action.ipc";
import type {
	MenuAction,
	MenuActionFormValues,
} from "../types/menu-action.type";
import { toMenuAction } from "../utils/menu-action.mapper";

export function useMenuActions() {
	const [actions, setActions] = useState<MenuAction[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchActions = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		const response = await getSelectionMenuActionList();

		if (!response.success) {
			setError(response.errorMessage ?? "Failed to load menu actions");
			setIsLoading(false);
			return;
		}

		setActions(response.data.actions.map(toMenuAction));
		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchActions();
	}, [fetchActions]);

	const updateAction = useCallback(
		async (actionId: string, data: Partial<SelectionMenuAction>) => {
			const response = await updateSelectionMenuAction({
				actionId,
				action: data,
			});

			if (!response.success) {
				setError(response.errorMessage ?? "Failed to update action");
				return false;
			}

			setActions((prev) =>
				prev.map((action) =>
					action.id === actionId ? toMenuAction(response.data.action) : action,
				),
			);
			return true;
		},
		[],
	);

	const toggleAction = useCallback(
		async (actionId: string) => {
			const action = actions.find((item) => item.id === actionId);
			if (!action) return false;

			return updateAction(actionId, { disabled: action.enabled });
		},
		[actions, updateAction],
	);

	const saveActionForm = useCallback(
		async (actionId: string, data: MenuActionFormValues) => {
			return updateAction(actionId, {
				name: data.name,
				description: data.description,
				promptWithPlaceholder: data.prompt,
			});
		},
		[updateAction],
	);

	const removeAction = useCallback(async (actionId: string) => {
		const response = await deleteSelectionMenuAction(actionId);

		if (!response.success) {
			setError(response.errorMessage ?? "Failed to delete action");
			return false;
		}

		setActions((prev) => prev.filter((action) => action.id !== actionId));
		return true;
	}, []);

	return {
		actions,
		isLoading,
		error,
		refresh: fetchActions,
		toggleAction,
		saveActionForm,
		removeAction,
	};
}
