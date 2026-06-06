export abstract class BaseChannel<ReqT, ResT> {
	abstract getName(): string;
	validate(_request: ReqT): boolean {
		return true;
	}
	abstract handle(
		event: Electron.IpcMainInvokeEvent,
		request: ReqT,
	): Promise<ResT>;
}
