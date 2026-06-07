import type { StorageData } from "../storage.schema";

export type DocumentRecord = StorageData<"documents">["records"][number];
