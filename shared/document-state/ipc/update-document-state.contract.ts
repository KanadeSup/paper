import type { DocumentState } from "../types/document-state.type";

export const UPDATE_DOCUMENT_STATE_CHANNEL_NAME = "update-document-state";

export type UpdateDocumentStateRequest = {
	documentId: string;
} & Partial<DocumentState>;

export type UpdateDocumentStateResponse = DocumentState;
