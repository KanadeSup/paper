export const SELECT_STORAGE_DIRECTORY_CHANNEL_NAME = "select-storage-directory";

export type SelectStorageDirectoryRequest = undefined;

export type SelectStorageDirectoryResponse = {
	path: string | null;
};
