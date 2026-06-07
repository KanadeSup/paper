import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	UPDATE_APP_CONFIG_CHANNEL_NAME,
	type UpdateAppConfigRequest,
	type UpdateAppConfigResponse,
} from "@shared/app-config/ipc/update-app-config.contract";
import { AppConfigService } from "../services/app-config.service";

export class UpdateAppConfigChannel extends BaseChannel<
	UpdateAppConfigRequest,
	UpdateAppConfigResponse
> {
	private readonly appConfigService = new AppConfigService();

	getName(): string {
		return UPDATE_APP_CONFIG_CHANNEL_NAME;
	}

	async handle(
		_event: Electron.IpcMainInvokeEvent,
		request: UpdateAppConfigRequest,
	): Promise<UpdateAppConfigResponse> {
		return this.appConfigService.updateConfig(request);
	}
}
