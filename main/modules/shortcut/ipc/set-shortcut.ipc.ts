import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	SET_SHORTCUT_CHANNEL_NAME,
	type SetShortcutRequest,
	type SetShortcutResponse,
} from "@shared/shortcut/ipc/set-shortcut.contract";
import { ShortcutService } from "../services/shortcut.service";

export class SetShortcutChannel extends BaseChannel<
	SetShortcutRequest,
	SetShortcutResponse
> {
	private readonly shortcutService = new ShortcutService();

	getName(): string {
		return SET_SHORTCUT_CHANNEL_NAME;
	}

	async handle(
		_event: Electron.IpcMainInvokeEvent,
		request: SetShortcutRequest,
	): Promise<SetShortcutResponse> {
		this.shortcutService.set(request.shortcutId, request.key);
		return null;
	}
}
