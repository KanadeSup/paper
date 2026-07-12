import type { DocumentState } from "../types/document-state.type";

export const GET_DOCUMENT_STATE_CHANNEL_NAME = "get-document-state";

export type GetDocumentStateRequest = {
	documentId: string;
};

export type GetDocumentStateResponse = DocumentState | null;
