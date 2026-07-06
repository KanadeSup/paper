import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	GET_SELECTION_MENU_ACTION_LIST_CHANNEL_NAME,
	type GetSelectionMenuActionListRequest,
	type GetSelectionMenuActionListResponse,
} from "@shared/selection-action/ipc/get-selection-menu-action-list.contract";
import { SelectionActionService } from "../services/selection-action.service";

export class GetSelectionMenuActionListChannel extends BaseChannel<
	GetSelectionMenuActionListRequest,
	GetSelectionMenuActionListResponse
> {
	private readonly selectionActionService = new SelectionActionService();

	getName(): string {
		return GET_SELECTION_MENU_ACTION_LIST_CHANNEL_NAME;
	}

	async handle(): Promise<GetSelectionMenuActionListResponse> {
		const actions = await this.selectionActionService.getActionList();
		return {
			actions,
		};
	}
}
