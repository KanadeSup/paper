import { BadRequestError } from "@main/modules/common/errors/common.error";
import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	GET_DOCUMENT_CHANNEL_NAME,
	type GetDocumentRequest,
	type GetDocumentResponse,
} from "@shared/library/ipc/get-document.contract";
import { LibraryService } from "../services/library.service";

export class GetDocumentChannel extends BaseChannel<
	GetDocumentRequest,
	GetDocumentResponse
> {
	private readonly libraryService = new LibraryService();

	getName(): string {
		return GET_DOCUMENT_CHANNEL_NAME;
	}

	validate(request: GetDocumentRequest): boolean {
		return (
			typeof request?.documentId === "string" && request.documentId.length > 0
		);
	}

	async handle(
		_event: Electron.IpcMainInvokeEvent,
		request: GetDocumentRequest,
	): Promise<GetDocumentResponse> {
		if (!this.validate(request)) {
			throw new BadRequestError("Invalid request");
		}

		return this.libraryService.getDocument(request.documentId);
	}
}
