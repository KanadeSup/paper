import type { AppConfig } from "@shared/app-config/types/app-config.type";
import { create } from "zustand";
import { getAppConfig, updateAppConfig } from "../ipc/app-config.ipc";

type ConfigState = {
	appConfig: {
		storagePath: string | null;
	};
	actions: {
		load: () => Promise<boolean>;
		update: (partial: Partial<ConfigState["appConfig"]>) => Promise<boolean>;
	};
};

export const useConfigStore = create<ConfigState>((set, get) => ({
	appConfig: {
		storagePath: null,
	},
	actions: {
		load: async () => {
			const response = await getAppConfig();

			if (!response.success) {
				return false;
			}

			const appConfig: AppConfig = response.data;

			set({ appConfig });
			return true;
		},

		update: async (partial) => {
			const response = await updateAppConfig(partial);

			if (!response.success) {
				return false;
			}

			await get().actions.load();

			return true;
		},
	},
}));
