import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
	ipcRenderer: {
		invoke: (channel: string, request?: unknown) =>
			ipcRenderer.invoke(channel, request),
		on: (channel: string, listener: (...args: unknown[]) => void) => {
			ipcRenderer.on(channel, (_event, ...args) => {
				listener(...args);
			});
		},
		removeAllListeners: (channel: string) => {
			ipcRenderer.removeAllListeners(channel);
		},
	},
});
