import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { LOCAL_ASSET_PROTOCOL } from "@shared/common/constants/local-asset.constant";
import { IMAGES_FOLDER } from "../constants/image-storage.constant";
import { FileSystemService } from "./file-system.services";

export class ImageStorageService {
	private readonly fileSystemService = new FileSystemService();

	getOrCreateImageStoragePath() {
		const imageStoragePath = join(
			this.fileSystemService.getOrCreateDataDirPath(),
			IMAGES_FOLDER,
		);
		if (!existsSync(imageStoragePath)) {
			mkdirSync(imageStoragePath, { recursive: true });
		}
		return imageStoragePath;
	}

	getOrCreateCategoryPath(category: string) {
		const categoryPath = join(this.getOrCreateImageStoragePath(), category);
		if (!existsSync(categoryPath)) {
			mkdirSync(categoryPath, { recursive: true });
		}
		return categoryPath;
	}

	getImagePath(category: string, filename: string) {
		return join(this.getOrCreateCategoryPath(category), filename);
	}

	getAssetUrl(category: string, filename: string) {
		return `${LOCAL_ASSET_PROTOCOL}://asset/${category}/${encodeURIComponent(filename)}`;
	}

	imageExists(category: string, filename: string) {
		return existsSync(this.getImagePath(category, filename));
	}

	saveImage(category: string, filename: string, data: Buffer) {
		writeFileSync(this.getImagePath(category, filename), data);
	}

	deleteImage(category: string, filename: string) {
		const imagePath = this.getImagePath(category, filename);
		if (existsSync(imagePath)) {
			unlinkSync(imagePath);
		}
	}
}
