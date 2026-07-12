import { BadRequestError } from "@main/modules/common/errors/common.error";
import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	UPDATE_DOCUMENT_STATE_CHANNEL_NAME,
	type UpdateDocumentStateRequest,
	type UpdateDocumentStateResponse,
} from "@shared/document-state/ipc/update-document-state.contract";
import { DocumentStateService } from "../services/document-state.service";

export class UpdateDocumentStateChannel extends BaseChannel<
	UpdateDocumentStateRequest,
	UpdateDocumentStateResponse
> {
	private readonly documentStateService = new DocumentStateService();

	getName(): string {
		return UPDATE_DOCUMENT_STATE_CHANNEL_NAME;
	}

	async handle(
		_event: Electron.IpcMainInvokeEvent,
		request: UpdateDocumentStateRequest,
	): Promise<UpdateDocumentStateResponse> {
		if (!this.validate(request)) {
			throw new BadRequestError("Invalid request");
		}

		const { documentId, ...partial } = request;
		return this.documentStateService.upsertState(documentId, partial);
	}
}
