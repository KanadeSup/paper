import type { AppConfig } from "../types/app-config.type";

export const UPDATE_APP_CONFIG_CHANNEL_NAME = "update-app-config";

export type UpdateAppConfigRequest = Partial<AppConfig>;

export type UpdateAppConfigResponse = AppConfig;
