import {
	BadRequestError,
	NotFoundError,
} from "@main/modules/common/errors/common.error";
import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	UPDATE_SELECTION_MENU_ACTION_CHANNEL_NAME,
	type UpdateSelectionMenuActionRequest,
	type UpdateSelectionMenuActionResponse,
} from "@shared/selection-action/ipc/update-selection-menu-action.contract";
import { SelectionActionService } from "../services/selection-action.service";

export class UpdateSelectionMenuActionChannel extends BaseChannel<
	UpdateSelectionMenuActionRequest,
	UpdateSelectionMenuActionResponse
> {
	private readonly selectionActionService = new SelectionActionService();

	getName(): string {
		return UPDATE_SELECTION_MENU_ACTION_CHANNEL_NAME;
	}

	async handle(
		_event: Electron.IpcMainInvokeEvent,
		request: UpdateSelectionMenuActionRequest,
	): Promise<UpdateSelectionMenuActionResponse> {
		const action = await this.selectionActionService.updateAction(
			request.actionId,
			request.action,
		);
		if (!action) {
			throw new NotFoundError("Selection menu action not found");
		}

		return {
			action,
		};
	}
}
