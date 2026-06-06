export const GET_DOCUMENT_LIST_CHANNEL_NAME = "get-document-list";

/* Get Document List */
export type ResponseDocument = {
	id: string;
	title: string;
	author: string | null;
	totalPages: number | null;
};

export type GetDocumentListRequest = undefined;

export type GetDocumentListResponse = {
	documents: Document[];
};
