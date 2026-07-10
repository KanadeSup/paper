import { mkdirSync } from "node:fs";
import path from "node:path";
import { app, BrowserWindow, ipcMain } from "electron";
import log from "electron-log/main";
import started from "electron-squirrel-startup";
import { GetApiKeysChannel, SetApiKeyChannel } from "./modules/api-key";
import {
	GetAppConfigChannel,
	SelectStorageDirectoryChannel,
	UpdateAppConfigChannel,
} from "./modules/app-config";

import { CreateChatSessionChannel } from "./modules/chat/ipc/create-chat-session.ipc";
import { DeleteChatSessionChannel } from "./modules/chat/ipc/delete-chat-session.ipc";
import { GetChatSessionChannel } from "./modules/chat/ipc/get-chat-session.ipc";
import { GetChatSessionsChannel } from "./modules/chat/ipc/get-chat-sessions.ipc";
import { SendMessageChannel } from "./modules/chat/ipc/send-message.ipc";
import { IpcResponseStatusCodes } from "./modules/common/constants/ipc-channel.constant";
import { BaseError } from "./modules/common/errors/base.error";
import { BadRequestError } from "./modules/common/errors/common.error";
import type { BaseChannel } from "./modules/common/ipc/channel.ipc";
import {
	registerLocalAssetScheme,
	setupLocalAssetProtocol,
} from "./modules/common/protocol/local-asset.protocol";
import type { IpcChannelResponse } from "./modules/common/types/ip-channel.type";
import { GetDocumentChannel, GetDocumentListChannel } from "./modules/library";
import {
	CreateSelectionMenuActionChannel,
	DeleteSelectionMenuActionChannel,
	GetSelectionMenuActionDetailChannel,
	GetSelectionMenuActionListChannel,
	UpdateSelectionMenuActionChannel,
} from "./modules/selection-action";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
	app.quit();
}

registerLocalAssetScheme();

log.initialize();

class Main {
	public init(ipcChannels?: BaseChannel<unknown, unknown>[]): void {
		this.setupPaths();
		app.whenReady().then(async () => {
			setupLocalAssetProtocol();
			this.onReady();
		});
		app.on("window-all-closed", this.onWindowAllClosed.bind(this));
		app.on("activate", this.onActivate.bind(this));
		this.registerIpcChannels(ipcChannels ?? []);
	}

	private onReady(): void {
		this.createWindow();
	}

	private onWindowAllClosed(): void {
		// Quit when all windows are closed, except on macOS. There, it's common
		// for applications and their menu bar to stay active until the user quits
		// explicitly with Cmd + Q.
		if (process.platform !== "darwin") {
			app.quit();
		}
	}

	private onActivate(): void {
		// On OS X it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) {
			this.createWindow();
		}
	}

	private setupPaths() {
		if (process.platform !== "linux") return;
		const dataPath = path.join(app.getPath("home"), ".data");
		// ensure the data path exists
		mkdirSync(dataPath, { recursive: true });
		app.setPath("appData", dataPath);
	}

	private createWindow(): void {
		const mainWindow = new BrowserWindow({
			width: 800,
			height: 600,
			webPreferences: {
				preload: path.join(__dirname, "preload.js"),
			},
			autoHideMenuBar: true,
		});

		// and load the index.html of the app.
		if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
			mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
		} else {
			mainWindow.loadFile(
				path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
			);
		}
	}

	private registerIpcChannels(
		ipcChannels: BaseChannel<unknown, unknown>[],
	): void {
		ipcChannels.forEach((channel) => {
			ipcMain.handle(
				channel.getName(),
				async (event, request): Promise<IpcChannelResponse<unknown>> => {
					try {
						if (!channel.validate(request)) {
							throw new BadRequestError("Invalid request");
						}

						return {
							success: true,
							data: await channel.handle(event, request),
						};
					} catch (error) {
						if (error instanceof BaseError) {
							if (error.statusCode === IpcResponseStatusCodes.INTERNAL_ERROR) {
								log.error("Internal error caused by: ", channel.getName());
								log.error(error.stack);
								log.error("----------------------------");
							}
							return {
								data: null,
								success: false,
								statusCode: error.statusCode,
								errorCode: error.errorCode,
								errorMessage: error.message,
							};
						}

						// unexpected error
						log.error("Unexpected error caused by: ", channel.getName());
						if (error instanceof Error) {
							log.error(error.stack);
						}
						log.error("----------------------------");
						return {
							data: null,
							success: false,
							statusCode: IpcResponseStatusCodes.INTERNAL_ERROR,
							errorMessage: "Unexpected error happened in the internal",
						};
					}
				},
			);
		});
	}
}

new Main().init([
	new GetAppConfigChannel(),
	new UpdateAppConfigChannel(),
	new SelectStorageDirectoryChannel(),
	new GetDocumentListChannel(),
	new GetDocumentChannel(),
	new SendMessageChannel(),
	new CreateChatSessionChannel(),
	new GetChatSessionChannel(),
	new GetChatSessionsChannel(),
	new DeleteChatSessionChannel(),
	new GetSelectionMenuActionListChannel(),
	new GetSelectionMenuActionDetailChannel(),
	new CreateSelectionMenuActionChannel(),
	new UpdateSelectionMenuActionChannel(),
	new DeleteSelectionMenuActionChannel(),
	new GetApiKeysChannel(),
	new SetApiKeyChannel(),
]);
