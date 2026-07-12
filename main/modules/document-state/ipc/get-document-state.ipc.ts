import { BaseChannel } from "@main/modules/common/ipc/channel.ipc";
import {
	GET_DOCUMENT_STATE_CHANNEL_NAME,
	type GetDocumentStateRequest,
	type GetDocumentStateResponse,
} from "@shared/document-state/ipc/get-document-state.contract";
import { DocumentStateService } from "../services/document-state.service";

export class GetDocumentStateChannel extends BaseChannel<
	GetDocumentStateRequest,
	GetDocumentStateResponse
> {
	private readonly documentStateService = new DocumentStateService();

	getName(): string {
		return GET_DOCUMENT_STATE_CHANNEL_NAME;
	}

	async handle(
		_event: Electron.IpcMainInvokeEvent,
		request: GetDocumentStateRequest,
	): Promise<GetDocumentStateResponse> {
		return this.documentStateService.getState(request.documentId);
	}
}
