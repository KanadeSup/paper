import type { PdfBookmarkObject } from "@embedpdf/models";
import { useBookmarkCapability } from "@embedpdf/plugin-bookmark/react";
import { useScroll } from "@embedpdf/plugin-scroll/react";
import { ScrollArea } from "@renderer/modules/design-system";
import { useCallback, useEffect, useState } from "react";
import { PdfOutlineItem } from "./pdf-outline-item";

type PdfOutlineProps = {
	documentId: string;
};

export function PdfOutline({ documentId }: PdfOutlineProps) {
	const { provides: bookmarkProvides } = useBookmarkCapability();
	const { provides: scrollProvides } = useScroll(documentId);
	const [bookmarks, setBookmarks] = useState<PdfBookmarkObject[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const handleNavigate = useCallback(
		(pageNumber: number) => {
			scrollProvides?.scrollToPage({
				pageNumber,
				behavior: "smooth",
			});
		},
		[scrollProvides],
	);

	useEffect(() => {
		if (!bookmarkProvides) {
			return;
		}

		let cancelled = false;
		setIsLoading(true);
		setError(null);

		bookmarkProvides
			.forDocument(documentId)
			.getBookmarks()
			.toPromise()
			.then((result) => {
				if (cancelled) {
					return;
				}

				setBookmarks(result.bookmarks);
			})
			.catch((loadError: unknown) => {
				if (cancelled) {
					return;
				}

				const message =
					loadError instanceof Error
						? loadError.message
						: "Failed to load outline";
				setError(message);
				setBookmarks([]);
			})
			.finally(() => {
				if (!cancelled) {
					setIsLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [bookmarkProvides, documentId]);

	if (isLoading) {
		return null;
	}

	if (error) {
		return <p className="px-1 text-destructive text-sm">{error}</p>;
	}

	if (bookmarks.length === 0) {
		return (
			<p className="px-1 text-muted-foreground text-sm">No outline available</p>
		);
	}

	return (
		<ScrollArea className="min-h-0 flex-1 pr-3">
			<div>
				{bookmarks.map((bookmark, index) => (
					<PdfOutlineItem
						key={bookmark.title}
						itemKey={String(index)}
						bookmark={bookmark}
						depth={0}
						onNavigate={handleNavigate}
					/>
				))}
			</div>
		</ScrollArea>
	);
}
