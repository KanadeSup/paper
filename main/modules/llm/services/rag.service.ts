import fs from "node:fs";
import path from "node:path";
import { UnprocessableEntityError } from "@main/modules/common/errors/common.error";
import { DocumentService } from "@main/modules/document";
import { FileStorageService } from "@main/modules/file-system";
import OpenAI, { NotFoundError } from "openai";

const MAX_OPENAI_VECTOR_STORAGE_BYTES = 1024 * 1024 * 1024;
const MAX_DOCUMENT_FILE_BYTES = 1024 * 1024 * 1024;

export interface QueryOptions {
	maxNumResults?: number;
}

export class RagService {
	private readonly documentService = new DocumentService();
	private readonly fileStorageService = new FileStorageService();
	private readonly client: OpenAI;

	constructor(apiKey: string) {
		this.client = new OpenAI({
			apiKey: apiKey,
		});
	}

	/**
	 * Get or create a vector store ID for a document.
	 * @param documentId - The inode-based document ID.
	 * @returns The ID of the vector store.
	 */
	async getOrCreateVectorStoreId(documentId: string): Promise<string> {
		const storedRecord = this.fileStorageService.findCollectionRecord(
			"documentVectorStore",
			documentId,
		);

		if (
			storedRecord &&
			(await this.vectorStoreExists(storedRecord.vectorStoreId))
		) {
			return storedRecord.vectorStoreId;
		}

		const vectorStoreId = await this.createVectorStore(documentId);
		this.saveVectorStoreId(documentId, vectorStoreId);
		return vectorStoreId;
	}

	/**
	 * Query a vector store.
	 * @param vector_store_id - The ID of the vector store.
	 * @param query - The query to search the vector store.
	 * @returns The result of the query.
	 */
	async query(
		vector_store_id: string,
		query: string,
		options: QueryOptions = {},
	) {
		this.updateLastUsedAt(vector_store_id);

		const result = await this.client.vectorStores.search(vector_store_id, {
			query: query,
			max_num_results: options.maxNumResults,
		});
		return result;
	}

	private async vectorStoreExists(vectorStoreId: string): Promise<boolean> {
		try {
			await this.client.vectorStores.retrieve(vectorStoreId);
			return true;
		} catch (error) {
			if (error instanceof NotFoundError) {
				return false;
			}

			throw error;
		}
	}

	private async createVectorStore(documentId: string): Promise<string> {
		const filePath = this.documentService.resolveFilePath(documentId);
		const fileName = path.basename(filePath);
		const fileSizeBytes = fs.statSync(filePath).size;

		if (fileSizeBytes > MAX_DOCUMENT_FILE_BYTES) {
			throw new UnprocessableEntityError(
				"Document file size should be less than 1 GB",
			);
		}

		await this.ensureStorageCapacity(fileSizeBytes, documentId);

		const vectorStore = await this.client.vectorStores.create({
			name: fileName,
		});
		await this.client.vectorStores.files.uploadAndPoll(
			vectorStore.id,
			fs.createReadStream(filePath),
		);
		return vectorStore.id;
	}

	private async ensureStorageCapacity(
		requiredBytes: number,
		excludeDocumentId: string,
	): Promise<void> {
		let currentUsageBytes = await this.getTotalVectorStoreUsageBytes();

		const nextUsageBytes = currentUsageBytes + requiredBytes;

		if (nextUsageBytes <= MAX_OPENAI_VECTOR_STORAGE_BYTES) {
			return;
		}

		const recordsForEviction = this.getSortedDocVectorStores(excludeDocumentId);

		for (const record of recordsForEviction) {
			if (nextUsageBytes <= MAX_OPENAI_VECTOR_STORAGE_BYTES) {
				break;
			}

			const usageBytes = await this.getVectorStoreUsageBytes(
				record.vectorStoreId,
			);
			await this.deleteVectorStoreRecord(record);
			currentUsageBytes -= usageBytes;
		}

		if (currentUsageBytes + requiredBytes > MAX_OPENAI_VECTOR_STORAGE_BYTES) {
			throw new UnprocessableEntityError(
				"OpenAI vector store storage limit reached. Query fewer documents or remove large files.",
			);
		}
	}

	private async getTotalVectorStoreUsageBytes(): Promise<number> {
		let totalUsageBytes = 0;

		for await (const vectorStore of this.client.vectorStores.list()) {
			totalUsageBytes += vectorStore.usage_bytes;
		}

		return totalUsageBytes;
	}

	private async getVectorStoreUsageBytes(
		vectorStoreId: string,
	): Promise<number> {
		try {
			const vectorStore =
				await this.client.vectorStores.retrieve(vectorStoreId);
			return vectorStore.usage_bytes;
		} catch (error) {
			if (error instanceof NotFoundError) {
				return 0;
			}

			throw error;
		}
	}

	private getSortedDocVectorStores(excludeDocumentId: string) {
		const { records } = this.fileStorageService.getStorageData(
			"documentVectorStore",
		);

		return records
			.filter((record) => record.id !== excludeDocumentId)
			.sort(
				(a, b) =>
					(a.lastUsedAt?.getTime() ?? 0) - (b.lastUsedAt?.getTime() ?? 0),
			);
	}

	private async deleteVectorStoreRecord(record: {
		id: string;
		vectorStoreId: string;
	}): Promise<void> {
		try {
			await this.client.vectorStores.delete(record.vectorStoreId);
		} catch (error) {
			if (!(error instanceof NotFoundError)) {
				throw error;
			}
		}

		const { records } = this.fileStorageService.getStorageData(
			"documentVectorStore",
		);
		this.fileStorageService.setCollectionRecords(
			"documentVectorStore",
			records.filter((storedRecord) => storedRecord.id !== record.id),
		);
	}

	private updateLastUsedAt(vectorStoreId: string): void {
		const { records } = this.fileStorageService.getStorageData(
			"documentVectorStore",
		);
		const hasMatchingRecord = records.some(
			(record) => record.vectorStoreId === vectorStoreId,
		);

		if (!hasMatchingRecord) {
			return;
		}

		const updatedRecords = records.map((record) =>
			record.vectorStoreId === vectorStoreId
				? { ...record, lastUsedAt: new Date() }
				: record,
		);
		this.fileStorageService.setCollectionRecords(
			"documentVectorStore",
			updatedRecords,
		);
	}

	private saveVectorStoreId(documentId: string, vectorStoreId: string): void {
		const { records } = this.fileStorageService.getStorageData(
			"documentVectorStore",
		);
		const hasExistingRecord = records.some(
			(record) => record.id === documentId,
		);
		const now = new Date();

		if (!hasExistingRecord) {
			this.fileStorageService.createCollectionRecord("documentVectorStore", {
				id: documentId,
				vectorStoreId,
				lastUsedAt: now,
			});
			return;
		}

		const updatedRecords = records.map((record) =>
			record.id === documentId
				? { ...record, vectorStoreId, lastUsedAt: now }
				: record,
		);
		this.fileStorageService.setCollectionRecords(
			"documentVectorStore",
			updatedRecords,
		);
	}
}
