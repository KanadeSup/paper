import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
	type StorageData,
	type StorageDefinition,
	storageDefinition,
} from "../storage.schema";
import type { CollectionStorageKeys } from "../types/document-storage.type";
import { FileSystemService } from "./file-system.services";

export class FileStorageService {
	private readonly fileSystemService: FileSystemService;

	constructor() {
		this.fileSystemService = new FileSystemService();
	}

	/** Get the path to the storage directory */
	getOrCreateStorageDirPath() {
		const storagePath = join(
			this.fileSystemService.getOrCreateDataDirPath(),
			"storage",
		);
		if (!existsSync(storagePath)) {
			mkdirSync(storagePath, { recursive: true });
		}
		return storagePath;
	}

	/** Get the path to the storage file */
	getOrCreateStorageFilePath(name: keyof StorageDefinition) {
		const filePath = join(this.getOrCreateStorageDirPath(), `${name}.json`);
		if (!existsSync(filePath)) {
			const defaultData = storageDefinition[name].defaultData;
			writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
		}
		return filePath;
	}

	/** Get the storage data */
	getStorageData<T extends keyof StorageDefinition>(name: T): StorageData<T> {
		const filePath = this.getOrCreateStorageFilePath(name);
		const rawData = JSON.parse(readFileSync(filePath, "utf8"));
		const data = storageDefinition[name].schema.partial().parse(rawData);
		const defaultData = storageDefinition[name].defaultData;

		return {
			...defaultData,
			...data,
		} as StorageData<T>;
	}

	/** Update the storage data.
	 * If the value is undefined, it will be ignored.
	 */
	updateStorageData<T extends keyof StorageDefinition>(
		name: T,
		data: Partial<StorageData<T>>,
	) {
		const storageData = this.getStorageData(name);

		// Remove undefined values from the data
		const resolvedUpdatedData = Object.fromEntries(
			Object.entries(data).filter(([_, value]) => value !== undefined),
		);

		const mergedData = {
			...storageData,
			...resolvedUpdatedData,
		};

		const filePath = this.getOrCreateStorageFilePath(name);
		writeFileSync(filePath, JSON.stringify(mergedData, null, 2));
	}

	createCollectionRecord<T extends CollectionStorageKeys>(
		name: T,
		record: StorageData<T>["records"][number],
	) {
		const storageData = this.getStorageData(name);
		const oldRecords = storageData.records;
		const newRecords = [...oldRecords, record] as StorageData<T>["records"];
		this.setCollectionRecords(name, newRecords);
	}

	setCollectionRecords<T extends CollectionStorageKeys>(
		name: T,
		records: StorageData<T>["records"],
	) {
		const filePath = this.getOrCreateStorageFilePath(name);

		const data = storageDefinition[name].schema.parse({ records });
		writeFileSync(filePath, JSON.stringify(data, null, 2));
	}

	findCollectionRecord<T extends CollectionStorageKeys>(
		name: T,
		id: string,
	): StorageData<T>["records"][number] | null {
		const storageData = this.getStorageData(name);
		return storageData.records.find((record) => record.id === id) ?? null;
	}
}
