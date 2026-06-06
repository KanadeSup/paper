import { invoke } from "@renderer/modules/design-system/ipc/base.ipc";
import {
	GET_DOCUMENT_LIST_CHANNEL_NAME,
	type GetDocumentListResponse,
} from "@shared/library/ipc/get-document-list.contract";

export function getDocumentList() {
	return invoke<undefined, GetDocumentListResponse>(
		GET_DOCUMENT_LIST_CHANNEL_NAME,
		undefined,
	);
}
