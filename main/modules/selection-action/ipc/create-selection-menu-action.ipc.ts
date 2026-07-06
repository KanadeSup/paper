import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	CREATE_SELECTION_MENU_ACTION_CHANNEL_NAME,
	type CreateSelectionMenuActionRequest,
	type CreateSelectionMenuActionResponse,
} from "@shared/selection-action/ipc/create-selection-menu-action.contract";
import { SelectionActionService } from "../services/selection-action.service";

export class CreateSelectionMenuActionChannel extends BaseChannel<
	CreateSelectionMenuActionRequest,
	CreateSelectionMenuActionResponse
> {
	private readonly selectionActionService = new SelectionActionService();

	getName(): string {
		return CREATE_SELECTION_MENU_ACTION_CHANNEL_NAME;
	}

	async handle(
		_event: Electron.IpcMainInvokeEvent,
		request: CreateSelectionMenuActionRequest,
	): Promise<CreateSelectionMenuActionResponse> {
		const action = await this.selectionActionService.createAction(request);

		return {
			action,
		};
	}
}
