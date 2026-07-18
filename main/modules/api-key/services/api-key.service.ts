import { FileStorageService } from "@main/modules/file-system";
import type {
	ApiKeyProvider,
	ApiKeys,
} from "@shared/api-key/types/api-key.type";

export class ApiKeyService {
	private readonly fileStorageService = new FileStorageService();

	getAll(): ApiKeys {
		return this.fileStorageService.getStorageData("apiKeys");
	}

	set(provider: ApiKeyProvider, apiKey: string): void {
		this.fileStorageService.updateStorageData("apiKeys", {
			[provider]: apiKey,
		});
	}

	get(provider: ApiKeyProvider): string | null {
		const apiKeys = this.fileStorageService.getStorageData("apiKeys");
		if (apiKeys[provider] && apiKeys[provider].length > 0) {
			return apiKeys[provider];
		}
		return null;
	}
}
