import type { GetDocumentResponse } from "@shared/library/ipc/get-document.contract";
import { useCallback, useEffect, useState } from "react";
import { getDocument } from "../ipc/document.ipc";

export function useDocument(documentId: string) {
	const [document, setDocument] = useState<GetDocumentResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchDocument = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		const response = await getDocument(documentId);

		if (!response.success) {
			setDocument(null);
			setError(response.errorMessage ?? "Failed to load document");
			setIsLoading(false);
			return;
		}

		setDocument(response.data);
		setIsLoading(false);
	}, [documentId]);

	useEffect(() => {
		fetchDocument();
	}, [fetchDocument]);

	return {
		document,
		isLoading,
		error,
	};
}
