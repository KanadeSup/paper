import { FileStorageService } from "@main/modules/file-system";
import type { StorageData } from "@main/modules/file-system/storage.schema";

export class AppConfigService {
	private readonly fileStorageService = new FileStorageService();

	getConfig(): StorageData<"appConfigs"> {
		return this.fileStorageService.getStorageData("appConfigs");
	}

	updateConfig(
		partial: Partial<StorageData<"appConfigs">>,
	): StorageData<"appConfigs"> {
		this.fileStorageService.updateStorageData("appConfigs", partial);
		return this.getConfig();
	}
}
