import { invoke } from "@renderer/modules/design-system/ipc/base.ipc";
import {
	GET_DOCUMENT_STATE_CHANNEL_NAME,
	type GetDocumentStateRequest,
	type GetDocumentStateResponse,
} from "@shared/document-state/ipc/get-document-state.contract";
import {
	UPDATE_DOCUMENT_STATE_CHANNEL_NAME,
	type UpdateDocumentStateRequest,
	type UpdateDocumentStateResponse,
} from "@shared/document-state/ipc/update-document-state.contract";

export function getDocumentState(documentId: string) {
	return invoke<GetDocumentStateRequest, GetDocumentStateResponse>(
		GET_DOCUMENT_STATE_CHANNEL_NAME,
		{ documentId },
	);
}

export function updateDocumentState(request: UpdateDocumentStateRequest) {
	return invoke<UpdateDocumentStateRequest, UpdateDocumentStateResponse>(
		UPDATE_DOCUMENT_STATE_CHANNEL_NAME,
		request,
	);
}
