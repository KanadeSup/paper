import type { ResponseDocument } from "./get-document-list.contract";

export const UPDATE_DOCUMENT_CHANNEL_NAME = "update-document";

export type UpdateDocumentRequest = {
	documentId: string;
	title?: string | null;
	author?: string | null;
	tags?: string[];
};

export type UpdateDocumentResponse = {
	document: ResponseDocument;
};
