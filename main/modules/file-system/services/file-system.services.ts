import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { app } from "electron";

export class FileSystemService {
	/** Get the path to application data directory */
	getOrCreateDataDirPath() {
		const dataPath = join(app.getPath("userData"), "app-data");
		if (!existsSync(dataPath)) {
			mkdirSync(dataPath, { recursive: true });
		}
		return dataPath;
	}
}
