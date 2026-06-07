import { existsSync } from "node:fs";
import { resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { ImageStorageService } from "@main/modules/file-system";
import { LOCAL_ASSET_PROTOCOL } from "@shared/common/constants/local-asset.constant";
import { net, protocol } from "electron";

function isPathInside(parent: string, child: string) {
	const resolvedParent = resolve(parent) + sep;
	const resolvedChild = resolve(child);

	return resolvedChild.startsWith(resolvedParent);
}

export function registerLocalAssetScheme() {
	protocol.registerSchemesAsPrivileged([
		{
			scheme: LOCAL_ASSET_PROTOCOL,
			privileges: {
				standard: true,
				secure: true,
				supportFetchAPI: true,
				corsEnabled: true,
				stream: true,
			},
		},
	]);
}

export function setupLocalAssetProtocol() {
	const imageStorageService = new ImageStorageService();
	const imageStorageRoot = imageStorageService.getOrCreateImageStoragePath();

	protocol.handle(LOCAL_ASSET_PROTOCOL, (request) => {
		const url = new URL(request.url);
		const segments = url.pathname.split("/").filter(Boolean);

		if (segments.length !== 2) {
			return new Response("Not Found", { status: 404 });
		}

		const [category, encodedFilename] = segments;
		const filename = decodeURIComponent(encodedFilename);
		const filePath = imageStorageService.getImagePath(category, filename);

		if (!isPathInside(imageStorageRoot, filePath) || !existsSync(filePath)) {
			return new Response("Not Found", { status: 404 });
		}

		return net.fetch(pathToFileURL(filePath).href);
	});
}
