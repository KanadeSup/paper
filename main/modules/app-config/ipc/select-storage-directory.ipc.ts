import { InternalError } from "@main/modules/common/errors/common.error";
import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	SELECT_STORAGE_DIRECTORY_CHANNEL_NAME,
	type SelectStorageDirectoryRequest,
	type SelectStorageDirectoryResponse,
} from "@shared/app-config/ipc/select-storage-directory.contract";
import { BrowserWindow, dialog } from "electron";

export class SelectStorageDirectoryChannel extends BaseChannel<
	SelectStorageDirectoryRequest,
	SelectStorageDirectoryResponse
> {
	getName(): string {
		return SELECT_STORAGE_DIRECTORY_CHANNEL_NAME;
	}

	async handle(
		event: Electron.IpcMainInvokeEvent,
	): Promise<SelectStorageDirectoryResponse> {
		const window = BrowserWindow.fromWebContents(event.sender);
		if (!window) {
			throw new InternalError("Window not found");
		}
		const result = await dialog.showOpenDialog(window, {
			properties: ["openDirectory", "createDirectory"],
			title: "Select Storage Directory",
		});

		if (result.canceled || result.filePaths.length === 0) {
			return { path: null };
		}

		return { path: result.filePaths[0] ?? null };
	}
}
