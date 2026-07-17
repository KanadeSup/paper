import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	DELETE_SHORTCUT_CHANNEL_NAME,
	type DeleteShortcutRequest,
	type DeleteShortcutResponse,
} from "@shared/shortcut/ipc/delete-shortcut.contract";
import { ShortcutService } from "../services/shortcut.service";

export class DeleteShortcutChannel extends BaseChannel<
	DeleteShortcutRequest,
	DeleteShortcutResponse
> {
	private readonly shortcutService = new ShortcutService();

	getName(): string {
		return DELETE_SHORTCUT_CHANNEL_NAME;
	}

	async handle(
		_event: Electron.IpcMainInvokeEvent,
		request: DeleteShortcutRequest,
	): Promise<DeleteShortcutResponse> {
		this.shortcutService.delete(request.shortcutId);
		return null;
	}
}
