import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	GET_DOCUMENT_LIST_CHANNEL_NAME,
	type GetDocumentListRequest,
	type GetDocumentListResponse,
} from "@shared/library/ipc/get-document-list.contract";
import { LibraryService } from "../services/library.service";

export class GetDocumentListChannel extends BaseChannel<
	GetDocumentListRequest,
	GetDocumentListResponse
> {
	private readonly libraryService = new LibraryService();

	getName(): string {
		return GET_DOCUMENT_LIST_CHANNEL_NAME;
	}

	async handle(): Promise<GetDocumentListResponse> {
		const documents = await this.libraryService.getDocumentList();

		return { documents };
	}
}
