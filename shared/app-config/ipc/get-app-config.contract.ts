import type { AppConfig } from "../types/app-config.type";

export const GET_APP_CONFIG_CHANNEL_NAME = "get-app-config";

export type GetAppConfigRequest = undefined;

export type GetAppConfigResponse = AppConfig;
