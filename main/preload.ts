import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
	ipcRenderer: {
		invoke: (channel: string, request?: unknown) =>
			ipcRenderer.invoke(channel, request),
	},
});
