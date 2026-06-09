import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { AppConfigService } from "@main/modules/app-config/services/app-config.service";
import {
	NotFoundError,
	UnprocessableEntityError,
} from "@main/modules/common/errors/common.error";
import {
	DOCUMENT_THUMBNAIL_CATEGORY,
	FileStorageService,
	ImageStorageService,
} from "@main/modules/file-system";
import type { DocumentRecord } from "@main/modules/file-system/types/document-storage.type";
import { PdfService } from "@main/modules/pdf";
import { LOCAL_ASSET_PROTOCOL } from "@shared/common/constants/local-asset.constant";
import type { GetDocumentResponse } from "@shared/library/ipc/get-document.contract";
import type { ResponseDocument } from "@shared/library/ipc/get-document-list.contract";

type ScannedDocument = {
	id: string;
	filePath: string;
	fileName: string;
};

export class LibraryService {
	private readonly appConfigService = new AppConfigService();
	private readonly fileStorageService = new FileStorageService();
	private readonly imageStorageService = new ImageStorageService();
	private readonly pdfService = new PdfService();

	async syncDocuments() {
		const storagePath = this.getStoragePath();

		const scannedDocuments = this.scanPdfDocuments(storagePath);
		const scannedDocumentMap = new Map(
			scannedDocuments.map((document) => [document.id, document]),
		);

		const { records } = this.fileStorageService.getStorageData("documents");
		const updatedRecords: DocumentRecord[] = [];

		// Synchronize documents
		for (const record of records) {
			const scannedDocument = scannedDocumentMap.get(record.id);

			// If the document record is not found in the user storage, delete the thumbnail and
			// the document record
			if (!scannedDocument) {
				this.imageStorageService.deleteImage(
					DOCUMENT_THUMBNAIL_CATEGORY,
					`${record.id}.png`,
				);
				continue;
			}

			updatedRecords.push(record);
			scannedDocumentMap.delete(record.id);
		}

		// Create new document records
		for (const scannedDocument of scannedDocumentMap.values()) {
			const record = await this.buildDocumentRecord(scannedDocument);
			updatedRecords.push(record);
			await this.ensureThumbnail(scannedDocument);
		}

		this.fileStorageService.updateStorageData("documents", {
			records: updatedRecords,
		});
	}

	async getDocument(documentId: string): Promise<GetDocumentResponse> {
		await this.syncDocuments();

		const scannedDocument = this.findScannedDocument(documentId);
		if (!scannedDocument) {
			throw new NotFoundError("Document not found");
		}

		const { records } = this.fileStorageService.getStorageData("documents");
		const record = records.find((document) => document.id === documentId);
		const thumbnailFilename = `${documentId}.png`;
		const isThumbnailExists = this.imageStorageService.imageExists(
			DOCUMENT_THUMBNAIL_CATEGORY,
			thumbnailFilename,
		);

		return {
			id: documentId,
			title: record?.title ?? null,
			author: record?.author ?? null,
			totalPages: record?.totalPages ?? null,
			thumbnail: isThumbnailExists
				? this.imageStorageService.getAssetUrl(
						DOCUMENT_THUMBNAIL_CATEGORY,
						thumbnailFilename,
					)
				: null,
			fileName: scannedDocument.fileName,
			url: this.getDocumentUrl(documentId),
		};
	}

	resolveDocumentPath(documentId: string): string {
		const scannedDocument = this.findScannedDocument(documentId);
		if (!scannedDocument) {
			throw new NotFoundError("Document not found");
		}

		return scannedDocument.filePath;
	}

	async getDocumentList(): Promise<ResponseDocument[]> {
		await this.syncDocuments();

		const { records } = this.fileStorageService.getStorageData("documents");

		return records.map((document) => {
			const thumbnailFilename = `${document.id}.png`;

			const isThumbnailExists = this.imageStorageService.imageExists(
				DOCUMENT_THUMBNAIL_CATEGORY,
				thumbnailFilename,
			);

			return {
				id: document.id,
				title: document.title,
				author: document.author,
				totalPages: document.totalPages,
				thumbnail: isThumbnailExists
					? this.imageStorageService.getAssetUrl(
							DOCUMENT_THUMBNAIL_CATEGORY,
							thumbnailFilename,
						)
					: null,
				fileName: document.fileName,
			};
		});
	}

	private findScannedDocument(documentId: string): ScannedDocument | null {
		const storagePath = this.getStoragePath();
		const scannedDocuments = this.scanPdfDocuments(storagePath);

		return (
			scannedDocuments.find((document) => document.id === documentId) ?? null
		);
	}

	getStoragePath() {
		const { storagePath } = this.appConfigService.getConfig();

		if (!storagePath) {
			throw new UnprocessableEntityError("Storage path is not configured");
		}

		return storagePath;
	}

	private scanPdfDocuments(storagePath: string): ScannedDocument[] {
		if (!existsSync(storagePath)) {
			throw new UnprocessableEntityError("Storage directory does not exist");
		}

		const entries = readdirSync(storagePath, { withFileTypes: true });

		return entries
			.filter(
				(entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".pdf"),
			)
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

	private async ensureThumbnail(document: ScannedDocument) {
		const thumbnailFilename = `${document.id}.png`;

		const isThumbnailExists = this.imageStorageService.imageExists(
			DOCUMENT_THUMBNAIL_CATEGORY,
			thumbnailFilename,
		);
		if (isThumbnailExists) {
			return;
		}

		const thumbnailBuffer = await this.pdfService.renderThumbnail(
			document.filePath,
			document.id,
		);

		this.imageStorageService.saveImage(
			DOCUMENT_THUMBNAIL_CATEGORY,
			thumbnailFilename,
			thumbnailBuffer,
		);
	}

	private async buildDocumentRecord(
		document: ScannedDocument,
	): Promise<DocumentRecord> {
		const metadata = await this.pdfService.extractMetadata(
			document.filePath,
			document.id,
		);

		return {
			id: document.id,
			title: metadata.title,
			author: metadata.author,
			totalPages: metadata.totalPages,
			fileName: document.fileName,
		};
	}

	private getDocumentUrl(documentId: string) {
		return `${LOCAL_ASSET_PROTOCOL}://document/${encodeURIComponent(documentId)}`;
	}
}
