/// <reference types="vite/client" />

export {};

declare global {
	interface Window {
		electron: {
			ipcRenderer: {
				invoke: (channel: string, request?: unknown) => Promise<unknown>;
				on(
					channel: string,
					listener: (event: Electron.IpcMainEvent, response?: unknown) => void,
				): () => void;
				removeAllListeners(channel: string): void;
			};
		};
	}
}
