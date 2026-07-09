import { NotFoundError } from "@main/modules/common/errors/common.error";
import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	GET_SELECTION_MENU_ACTION_DETAIL_CHANNEL_NAME,
	type GetSelectionMenuActionDetailRequest,
	type GetSelectionMenuActionDetailResponse,
} from "@shared/selection-action/ipc/get-selection-menu-action-detail.contract";
import { SelectionActionService } from "../services/selection-action.service";

export class GetSelectionMenuActionDetailChannel extends BaseChannel<
	GetSelectionMenuActionDetailRequest,
	GetSelectionMenuActionDetailResponse
> {
	private readonly selectionActionService = new SelectionActionService();

	getName(): string {
		return GET_SELECTION_MENU_ACTION_DETAIL_CHANNEL_NAME;
	}

	async handle(
		_event: Electron.IpcMainInvokeEvent,
		request: GetSelectionMenuActionDetailRequest,
	): Promise<GetSelectionMenuActionDetailResponse> {
		const action = await this.selectionActionService.getActionDetail(
			request.actionId,
		);
		if (!action) {
			throw new NotFoundError("Selection menu action not found");
		}

		return {
			action,
		};
	}
}
