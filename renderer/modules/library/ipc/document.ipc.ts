import { invoke } from "@renderer/modules/design-system/ipc/base.ipc";
import {
	GET_DOCUMENT_CHANNEL_NAME,
	type GetDocumentRequest,
	type GetDocumentResponse,
} from "@shared/library/ipc/get-document.contract";
import {
	GET_DOCUMENT_LIST_CHANNEL_NAME,
	type GetDocumentListResponse,
} from "@shared/library/ipc/get-document-list.contract";
import {
	UPDATE_DOCUMENT_CHANNEL_NAME,
	type UpdateDocumentRequest,
	type UpdateDocumentResponse,
} from "@shared/library/ipc/update-document.contract";

export function getDocumentList() {
	return invoke<undefined, GetDocumentListResponse>(
		GET_DOCUMENT_LIST_CHANNEL_NAME,
		undefined,
	);
}

export function getDocument(documentId: string) {
	return invoke<GetDocumentRequest, GetDocumentResponse>(
		GET_DOCUMENT_CHANNEL_NAME,
		{ documentId },
	);
}

export function updateDocument(request: UpdateDocumentRequest) {
	return invoke<UpdateDocumentRequest, UpdateDocumentResponse>(
		UPDATE_DOCUMENT_CHANNEL_NAME,
		request,
	);
}
