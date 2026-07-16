import { FileStorageService } from "@main/modules/file-system";
import type { DocumentStateRecord } from "@main/modules/file-system/types/document-storage.type";
import type { DocumentState } from "@shared/document-state/types/document-state.type";

const DEFAULT_DOCUMENT_STATE: DocumentState = {
	currentPage: 1,
	zoomLevel: "automatic",
	isPdfChatOpen: false,
	isSidebarOpen: false,
	sidebarWidth: null,
	pdfChatWidth: null,
};

export class DocumentStateService {
	private readonly fileStorageService = new FileStorageService();

	getState(documentId: string): DocumentState | null {
		const record = this.fileStorageService.findCollectionRecord(
			"documentStates",
			documentId,
		);

		if (!record) {
			return null;
		}

		return this.toDocumentState(record);
	}

	upsertState(
		documentId: string,
		partial: Partial<DocumentState>,
	): DocumentState {
		const { records } =
			this.fileStorageService.getStorageData("documentStates");
		const targetIndex = records.findIndex((record) => record.id === documentId);

		const nextRecord: DocumentStateRecord =
			targetIndex >= 0
				? {
						...records[targetIndex],
						...this.omitUndefined(partial),
					}
				: {
						id: documentId,
						...DEFAULT_DOCUMENT_STATE,
						...this.omitUndefined(partial),
					};

		const nextRecords =
			targetIndex >= 0
				? records.map((record, index) =>
						index === targetIndex ? nextRecord : record,
					)
				: [...records, nextRecord];

		this.fileStorageService.setCollectionRecords("documentStates", nextRecords);

		return this.toDocumentState(nextRecord);
	}

	private toDocumentState(record: DocumentStateRecord): DocumentState {
		return {
			currentPage: record.currentPage,
			zoomLevel: record.zoomLevel,
			isPdfChatOpen: record.isPdfChatOpen,
			isSidebarOpen: record.isSidebarOpen,
			sidebarWidth: record.sidebarWidth ?? null,
			pdfChatWidth: record.pdfChatWidth ?? null,
		};
	}

	private omitUndefined(
		partial: Partial<DocumentState>,
	): Partial<DocumentState> {
		return Object.fromEntries(
			Object.entries(partial).filter(([, value]) => value !== undefined),
		) as Partial<DocumentState>;
	}
}
