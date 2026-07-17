import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	GET_SHORTCUTS_CHANNEL_NAME,
	type GetShortcutsRequest,
	type GetShortcutsResponse,
} from "@shared/shortcut/ipc/get-shortcuts.contract";
import { ShortcutService } from "../services/shortcut.service";

export class GetShortcutsChannel extends BaseChannel<
	GetShortcutsRequest,
	GetShortcutsResponse
> {
	private readonly shortcutService = new ShortcutService();

	getName(): string {
		return GET_SHORTCUTS_CHANNEL_NAME;
	}

	async handle(): Promise<GetShortcutsResponse> {
		return {
			shortcuts: this.shortcutService.getAll(),
		};
	}
}
