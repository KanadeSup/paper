import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { AppConfigService } from "@main/modules/app-config/services/app-config.service";
import {
	NotFoundError,
	UnprocessableEntityError,
} from "@main/modules/common/errors/common.error";

export type ScannedFile = {
	id: string;
	filePath: string;
	fileName: string;
};

export class DocumentService {
	private readonly appConfigService = new AppConfigService();

	getStoragePath(): string {
		const { storagePath } = this.appConfigService.getConfig();

		if (!storagePath) {
			throw new UnprocessableEntityError("Storage path is not configured");
		}

		return storagePath;
	}

	resolveFilePath(documentId: string): string {
		const file = this.findFileByDocumentId(documentId);
		if (!file) {
			throw new NotFoundError("Document not found");
		}

		return file.filePath;
	}

	findFileByDocumentId(documentId: string): ScannedFile | null {
		const storagePath = this.getStoragePath();
		const files = this.scanFiles(storagePath);

		return files.find((file) => file.id === documentId) ?? null;
	}

	scanPdfFiles(storagePath?: string): ScannedFile[] {
		return this.scanFiles(storagePath ?? this.getStoragePath()).filter((file) =>
			file.fileName.toLowerCase().endsWith(".pdf"),
		);
	}

	private scanFiles(storagePath: string): ScannedFile[] {
		if (!existsSync(storagePath)) {
			throw new UnprocessableEntityError("Storage directory does not exist");
		}

		const entries = readdirSync(storagePath, { withFileTypes: true });

		return entries
			.filter((entry) => entry.isFile())
			.map((entry) => {
				const filePath = join(storagePath, entry.name);
				const { ino } = statSync(filePath);

				return {
					id: ino.toString(),
					filePath,
					fileName: entry.name,
				};
			});
	}
}
