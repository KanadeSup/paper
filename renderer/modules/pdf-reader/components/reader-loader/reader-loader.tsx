import { useBookmarkCapability } from "@embedpdf/plugin-bookmark/react";
import { Button } from "@renderer/modules/design-system";
import { useRouter } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { usePdfReaderStore } from "../../provider/pdf-reader-provider";
import {
	resolveBookmarkEndPage,
	resolveBookmarkStartPage,
} from "../../utils/pdf.utils";

type ReaderLoaderProps = {
	documentId: string;
	children: React.ReactNode;
};

export function ReaderLoader({ documentId, children }: ReaderLoaderProps) {
	const pdfReaderActions = usePdfReaderStore((state) => state.actions);
	const { provides: bookmarkProvides } = useBookmarkCapability();
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
				pdfReaderActions.setOutline(bookmarks);
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
	}, [bookmarkProvides, pdfReaderActions, documentId]);

	useEffect(() => {
		loadOutline();
	}, [loadOutline]);

	if (isLoading) {
		return null;
	}
	if (error) {
		return <LoadError error={error} />;
	}

	return children;
}

type LoadErrorProps = {
	error: string;
};
function LoadError({ error }: LoadErrorProps) {
	const router = useRouter();
	return (
		<div className="w-full h-full flex flex-col gap-2 items-center justify-center text-destructive">
			{error}
			<Button
				variant="default"
				onClick={() => {
					router.navigate({ to: "/" });
				}}
			>
				Go back
			</Button>
		</div>
	);
}
