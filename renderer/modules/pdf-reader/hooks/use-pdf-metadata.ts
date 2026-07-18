import { useRegistry } from "@embedpdf/core/react";
import { useBookmarkCapability } from "@embedpdf/plugin-bookmark/react";
import { useDocumentManagerCapability } from "@embedpdf/plugin-document-manager/react";
import Logger from "electron-log/renderer.js";
import { useCallback, useEffect, useState } from "react";
import type { PdfMetadata, PdfOutlineObject } from "../types/pdf.type";
import {
	resolveBookmarkEndPage,
	resolveBookmarkStartPage,
} from "../utils/pdf.utils";

export function usePdfMetadata(documentId: string) {
	const { registry } = useRegistry();
	const engine = registry?.getEngine() ?? null;
	const { provides: bookmarkProvides } = useBookmarkCapability();
	const { provides: documentProvides } = useDocumentManagerCapability();

	const [metadata, setMetadata] = useState<PdfMetadata | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const isReady = Boolean(engine && bookmarkProvides && documentProvides);

	const loadMetadata = useCallback(async () => {
		if (!engine || !bookmarkProvides || !documentProvides) return;

		setIsLoading(true);
		setError(null);

		try {
			const document = documentProvides.getDocument(documentId);
			if (!document) {
				throw new Error("Document not found");
			}

			const [bookmarkResult, pdfMetadata] = await Promise.all([
				bookmarkProvides.forDocument(documentId).getBookmarks().toPromise(),
				engine.getMetadata(document).toPromise(),
			]);

			const outlines: PdfOutlineObject[] = bookmarkResult.bookmarks;
			resolveBookmarkStartPage(outlines);
			resolveBookmarkEndPage(outlines, null);

			setMetadata({
				...pdfMetadata,
				outlines: outlines,
			});
		} catch (err) {
			Logger.error("Failed to load PDF metadata", err);
			setMetadata(null);
			setError(
				err instanceof Error ? err.message : "Failed to load PDF metadata",
			);
		} finally {
			setIsLoading(false);
		}
	}, [bookmarkProvides, documentProvides, engine, documentId]);

	useEffect(() => {
		if (!isReady) return;
		loadMetadata();
	}, [isReady, loadMetadata]);

	return {
		metadata,
		isLoading: !isReady || isLoading,
		error,
		reload: loadMetadata,
	};
}
