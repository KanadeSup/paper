import { invoke } from "@renderer/modules/design-system/ipc/base.ipc";
import {
	GET_APP_CONFIG_CHANNEL_NAME,
	type GetAppConfigResponse,
} from "@shared/app-config/ipc/get-app-config.contract";
import {
	SELECT_STORAGE_DIRECTORY_CHANNEL_NAME,
	type SelectStorageDirectoryResponse,
} from "@shared/app-config/ipc/select-storage-directory.contract";
import {
	UPDATE_APP_CONFIG_CHANNEL_NAME,
	type UpdateAppConfigRequest,
	type UpdateAppConfigResponse,
} from "@shared/app-config/ipc/update-app-config.contract";

export function getAppConfig() {
	return invoke<undefined, GetAppConfigResponse>(
		GET_APP_CONFIG_CHANNEL_NAME,
		undefined,
	);
}

export function updateAppConfig(request: UpdateAppConfigRequest) {
	return invoke<UpdateAppConfigRequest, UpdateAppConfigResponse>(
		UPDATE_APP_CONFIG_CHANNEL_NAME,
		request,
	);
}

export function selectStorageDirectory() {
	return invoke<undefined, SelectStorageDirectoryResponse>(
		SELECT_STORAGE_DIRECTORY_CHANNEL_NAME,
		undefined,
	);
}
