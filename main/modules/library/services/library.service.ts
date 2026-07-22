import { NotFoundError } from "@main/modules/common/errors/common.error";
import { DocumentService, type ScannedFile } from "@main/modules/document";
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
import type { UpdateDocumentRequest } from "@shared/library/ipc/update-document.contract";

export class LibraryService {
	private readonly documentService = new DocumentService();
	private readonly fileStorageService = new FileStorageService();
	private readonly imageStorageService = new ImageStorageService();
	private readonly pdfService = new PdfService();

	async syncDocuments() {
		const storagePath = this.getStoragePath();

		const scannedDocuments = this.documentService.scanPdfFiles(storagePath);
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

			updatedRecords.push({
				...record,
				fileName: scannedDocument.fileName,
				fileSize: scannedDocument.fileSize,
				tags: record.tags ?? [],
			});
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
		if (!record) {
			throw new NotFoundError("Document not found");
		}

		return {
			...this.toResponseDocument(record),
			url: this.getDocumentUrl(documentId),
		};
	}

	resolveDocumentPath(documentId: string): string {
		return this.documentService.resolveFilePath(documentId);
	}

	async getDocumentList(): Promise<ResponseDocument[]> {
		await this.syncDocuments();

		const { records } = this.fileStorageService.getStorageData("documents");

		return records.map((document) => this.toResponseDocument(document));
	}

	async updateDocument(
		documentId: string,
		data: Omit<UpdateDocumentRequest, "documentId">,
	): Promise<ResponseDocument> {
		const { records } = this.fileStorageService.getStorageData("documents");
		const targetIndex = records.findIndex(
			(document) => document.id === documentId,
		);
		if (targetIndex < 0) {
			throw new NotFoundError("Document not found");
		}

		const targetRecord = records[targetIndex];
		const nextRecord: DocumentRecord = {
			...targetRecord,
			...(data.title !== undefined ? { title: data.title } : {}),
			...(data.author !== undefined ? { author: data.author } : {}),
			...(data.tags !== undefined ? { tags: data.tags } : {}),
		};

		records[targetIndex] = nextRecord;
		this.fileStorageService.setCollectionRecords("documents", records);

		return this.toResponseDocument(nextRecord);
	}

	private findScannedDocument(documentId: string) {
		return this.documentService.findFileByDocumentId(documentId);
	}

	getStoragePath() {
		return this.documentService.getStoragePath();
	}

	private async ensureThumbnail(document: ScannedFile) {
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
		document: ScannedFile,
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
			fileSize: document.fileSize,
			tags: [],
		};
	}

	private toResponseDocument(document: DocumentRecord): ResponseDocument {
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
			fileSize: document.fileSize ?? null,
			tags: document.tags ?? [],
		};
	}

	private getDocumentUrl(documentId: string) {
		return `${LOCAL_ASSET_PROTOCOL}://document/${encodeURIComponent(documentId)}`;
	}
}
