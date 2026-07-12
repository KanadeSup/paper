import { useBookmarkCapability } from "@embedpdf/plugin-bookmark/react";
import { useCallback, useEffect, useState } from "react";
import type { PdfOutlineObject } from "../types/pdf.type";
import {
	resolveBookmarkEndPage,
	resolveBookmarkStartPage,
} from "../utils/pdf.utils";

export function useOutlines(documentId: string) {
	const { provides: bookmarkProvides } = useBookmarkCapability();
	const [outline, setOutline] = useState<PdfOutlineObject[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadOutline = useCallback(() => {
		if (!bookmarkProvides) {
			return;
		}

		setIsLoading(true);
		setError(null);

		bookmarkProvides
			.forDocument(documentId)
			.getBookmarks()
			.toPromise()
			.then((result) => {
				const bookmarks = result.bookmarks;
				resolveBookmarkStartPage(bookmarks);
				resolveBookmarkEndPage(bookmarks, null);
				setOutline(bookmarks);
			})
			.catch((loadError: unknown) => {
				const message =
					loadError instanceof Error
						? loadError.message
						: "Failed to load outline";
				setError(message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [bookmarkProvides, documentId]);

	useEffect(() => {
		loadOutline();
	}, [loadOutline]);

	return {
		outline,
		isLoading,
		error,
		reload: loadOutline,
	};
}
