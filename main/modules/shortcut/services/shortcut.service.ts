import {
	NotFoundError,
	UnprocessableEntityError,
} from "@main/modules/common/errors/common.error";
import { FileStorageService } from "@main/modules/file-system";
import type {
	ShortcutId,
	ShortcutValues,
} from "@shared/shortcut/types/shortcut.type";
import {
	findShortcutKeyConflict,
	getShortcutDefinition,
	parseShortcutKey,
	toShortcutValues,
} from "@shared/shortcut/utils/shortcut.util";

export class ShortcutService {
	private readonly fileStorageService = new FileStorageService();

	getAll(): ShortcutValues {
		const { records } = this.fileStorageService.getStorageData("shortcuts");
		return toShortcutValues(records);
	}

	set(shortcutId: ShortcutId, key: string): void {
		if (!getShortcutDefinition(shortcutId)) {
			throw new NotFoundError(`Shortcut "${shortcutId}" not found`);
		}

		const { records } = this.fileStorageService.getStorageData("shortcuts");

		const values = toShortcutValues(records);

		const keys = parseShortcutKey(key);
		if (keys.length === 0) {
			throw new UnprocessableEntityError(`Shortcut key is empty`);
		}

		const conflict = findShortcutKeyConflict({
			shortcutId,
			keys,
			values,
		});
		if (conflict) {
			throw new UnprocessableEntityError(
				`Shortcut key conflicts with "${conflict.title}"`,
			);
		}

		// If the shortcut is found, set the key
		// Otherwise, create a new record with the shortcut id and key
		const foundIndex = records.findIndex((record) => record.id === shortcutId);
		const newRecords = [...records];
		if (foundIndex >= 0) {
			newRecords[foundIndex] = { id: shortcutId, key };
		} else {
			newRecords.push({ id: shortcutId, key });
		}

		this.fileStorageService.setCollectionRecords("shortcuts", newRecords);
	}

	delete(shortcutId: ShortcutId): void {
		if (!getShortcutDefinition(shortcutId)) {
			throw new NotFoundError(`Shortcut "${shortcutId}" not found`);
		}

		const { records } = this.fileStorageService.getStorageData("shortcuts");

		const foundIndex = records.findIndex((record) => record.id === shortcutId);
		const newRecords = [...records];

		// If the shortcut is found, set the key to null
		// Otherwise, create a new record with the shortcut id and null key
		if (foundIndex >= 0) {
			newRecords[foundIndex] = { id: shortcutId, key: null };
		} else {
			newRecords.push({ id: shortcutId, key: null });
		}

		this.fileStorageService.setCollectionRecords("shortcuts", newRecords);
	}
}
