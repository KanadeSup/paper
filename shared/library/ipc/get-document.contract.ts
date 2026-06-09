import type { ResponseDocument } from "./get-document-list.contract";

export const GET_DOCUMENT_CHANNEL_NAME = "get-document";

export type GetDocumentRequest = {
	documentId: string;
};

export type GetDocumentResponse = ResponseDocument & {
	url: string;
};
