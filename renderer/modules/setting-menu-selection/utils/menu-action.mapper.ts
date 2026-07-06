import type { SelectionMenuAction } from "@shared/selection-action/types/selection-menu-action.type";
import {
	DEFAULT_ACTION_ICON,
	type MenuAction,
} from "../types/menu-action.type";

export function toMenuAction(action: SelectionMenuAction): MenuAction {
	return {
		id: action.id,
		name: action.name,
		description: action.description,
		prompt: action.promptWithPlaceholder,
		model: action.model,
		icon: DEFAULT_ACTION_ICON,
		enabled: !action.disabled,
	};
}
