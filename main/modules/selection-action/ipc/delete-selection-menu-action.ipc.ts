import {
	BadRequestError,
	NotFoundError,
} from "@main/modules/common/errors/common.error";
import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	DELETE_SELECTION_MENU_ACTION_CHANNEL_NAME,
	type DeleteSelectionMenuActionRequest,
	type DeleteSelectionMenuActionResponse,
} from "@shared/selection-action/ipc/delete-selection-menu-action.contract";
import { SelectionActionService } from "../services/selection-action.service";

export class DeleteSelectionMenuActionChannel extends BaseChannel<
	DeleteSelectionMenuActionRequest,
	DeleteSelectionMenuActionResponse
> {
	private readonly selectionActionService = new SelectionActionService();

	getName(): string {
		return DELETE_SELECTION_MENU_ACTION_CHANNEL_NAME;
	}

	async handle(
		_event: Electron.IpcMainInvokeEvent,
		request: DeleteSelectionMenuActionRequest,
	): Promise<DeleteSelectionMenuActionResponse> {
		const isDeleted = await this.selectionActionService.deleteAction(
			request.actionId,
		);
		if (!isDeleted) {
			throw new NotFoundError("Selection menu action not found");
		}

		return null;
	}
}
