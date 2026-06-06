type BaseIpcChannelResponse<T> = {
	success: boolean;
	data: T;
	statusCode?: number;
};

export type IpcChannelResponseSuccess<T> = BaseIpcChannelResponse<T> & {
	success: true;
};

export type IpcChannelResponseError = BaseIpcChannelResponse<null> & {
	success: false;
	errorCode?: string;
	errorMessage?: string;
};

export type IpcChannelResponse<T> =
	| IpcChannelResponseSuccess<T>
	| IpcChannelResponseError;
