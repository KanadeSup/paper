import type { StorageData, StorageDefinition } from "../storage.schema";

// Collection storage keys (automatically inferred from storage definition)
export type CollectionStorageKeys = {
	// biome-ignore lint/suspicious/noExplicitAny: The any type does not matter here
	[K in keyof StorageDefinition]: StorageData<K> extends { records: any[] }
		? K
		: never;
}[keyof StorageDefinition];

// Documents
export type DocumentRecord = StorageData<"documents">["records"][number];

// Chat sessions
export type ChatSessionRecord = StorageData<"chatSessions">["records"][number];
export type ChatMessageRecord = ChatSessionRecord["messages"][number];
export type ChatModelConfigurationRecord =
	ChatSessionRecord["modelConfiguration"];

// Selection menu actions
export type SelectionMenuActionRecord =
	StorageData<"selectionMenuActions">["records"][number];

// Document vector stores
export type DocumentVectorStoreRecord =
	StorageData<"documentVectorStore">["records"][number];
