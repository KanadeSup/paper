import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	GET_APP_CONFIG_CHANNEL_NAME,
	type GetAppConfigRequest,
	type GetAppConfigResponse,
} from "@shared/app-config/ipc/get-app-config.contract";
import { AppConfigService } from "../services/app-config.service";

export class GetAppConfigChannel extends BaseChannel<
	GetAppConfigRequest,
	GetAppConfigResponse
> {
	private readonly appConfigService = new AppConfigService();

	getName(): string {
		return GET_APP_CONFIG_CHANNEL_NAME;
	}

	async handle(): Promise<GetAppConfigResponse> {
		return this.appConfigService.getConfig();
	}
}
