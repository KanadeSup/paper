import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	GET_DOCUMENT_LIST_CHANNEL_NAME,
	type GetDocumentListRequest,
	type GetDocumentListResponse,
} from "@shared/library/ipc/get-document-list.contract";

export class GetDocumentListChannel extends BaseChannel<
	GetDocumentListRequest,
	GetDocumentListResponse
> {
	getName(): string {
		return GET_DOCUMENT_LIST_CHANNEL_NAME;
	}

	async handle(): Promise<GetDocumentListResponse> {
		return {
			documents: [],
		};
	}
}
