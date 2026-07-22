import { BadRequestError } from "@main/modules/common/errors/common.error";
import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	UPDATE_DOCUMENT_CHANNEL_NAME,
	type UpdateDocumentRequest,
	type UpdateDocumentResponse,
} from "@shared/library/ipc/update-document.contract";
import { LibraryService } from "../services/library.service";

export class UpdateDocumentChannel extends BaseChannel<
	UpdateDocumentRequest,
	UpdateDocumentResponse
> {
	private readonly libraryService = new LibraryService();

	getName(): string {
		return UPDATE_DOCUMENT_CHANNEL_NAME;
	}

	async handle(
		_event: Electron.IpcMainInvokeEvent,
		request: UpdateDocumentRequest,
	): Promise<UpdateDocumentResponse> {
		const { documentId, ...data } = request;
		const document = await this.libraryService.updateDocument(documentId, data);

		return { document };
	}
}
