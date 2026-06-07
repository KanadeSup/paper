import type { ResponseDocument } from "@shared/library/ipc/get-document-list.contract";
import { useCallback, useEffect, useState } from "react";
import { getDocumentList } from "../ipc/document.ipc";

export function useDocumentList() {
	const [documents, setDocuments] = useState<ResponseDocument[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchDocuments = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		const response = await getDocumentList();

		if (!response.success) {
			setError(response.errorMessage ?? "Failed to load documents");
			setIsLoading(false);
			return;
		}

		setDocuments(response.data.documents);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchDocuments();
	}, [fetchDocuments]);

	return {
		documents,
		isLoading,
		error,
		refresh: fetchDocuments,
	};
}
