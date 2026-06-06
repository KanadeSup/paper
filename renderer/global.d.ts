export {};

declare global {
	interface Window {
		electron: {
			ipcRenderer: {
				invoke: (channel: string, request?: unknown) => Promise<unknown>;
			};
		};
	}
}
