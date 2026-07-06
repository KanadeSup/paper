import { FileStorageService } from "@main/modules/file-system";
import type { SelectionMenuActionRecord } from "@main/modules/file-system/types/document-storage.type";

export class SelectionActionService {
	private readonly fileStorageService = new FileStorageService();

	async getActionList(): Promise<SelectionMenuActionRecord[]> {
		const { records } = this.fileStorageService.getStorageData(
			"selectionMenuActions",
		);
		return records.toSorted((a, b) => a.order - b.order);
	}

	async getActionDetail(
		actionId: string,
	): Promise<SelectionMenuActionRecord | null> {
		return this.fileStorageService.findCollectionRecord(
			"selectionMenuActions",
			actionId,
		);
	}

	async updateAction(
		actionId: string,
		updateActionData: Partial<SelectionMenuActionRecord>,
	): Promise<SelectionMenuActionRecord | null> {
		const { records } = this.fileStorageService.getStorageData(
			"selectionMenuActions",
		);
		const targetIndex = records.findIndex((record) => record.id === actionId);
		if (targetIndex < 0) {
			return null;
		}

		const targetAction = records[targetIndex];
		const nextAction: SelectionMenuActionRecord = {
			...targetAction,
			...updateActionData,
		};

		records[targetIndex] = nextAction;
		this.fileStorageService.setCollectionRecords(
			"selectionMenuActions",
			records,
		);
		return nextAction;
	}

	async deleteAction(actionId: string): Promise<boolean> {
		const { records } = this.fileStorageService.getStorageData(
			"selectionMenuActions",
		);
		const nextRecords = records.filter((record) => record.id !== actionId);
		if (nextRecords.length === records.length) {
			return false;
		}

		this.fileStorageService.setCollectionRecords(
			"selectionMenuActions",
			nextRecords,
		);
		return true;
	}
}
