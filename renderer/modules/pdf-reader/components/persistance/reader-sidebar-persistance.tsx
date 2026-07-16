import { debounce } from "lodash";
import { useEffect, useMemo } from "react";
import { updateDocumentState } from "../../ipc/document-state.ipc";
import { usePdfReaderStoreAPI } from "../../provider/pdf-reader-provider";

export type ReaderSidebarPersistanceProps = {
	documentId: string;
};

export function ReaderSidebarPersistance(props: ReaderSidebarPersistanceProps) {
	const { documentId } = props;

	const store = usePdfReaderStoreAPI();

	const debouncedUpdateWidth = useMemo(
		() =>
			debounce((width: number, type: "sidebar" | "pdfChat") => {
				updateDocumentState({
					documentId,
					sidebarWidth: type === "sidebar" ? width : undefined,
					pdfChatWidth: type === "pdfChat" ? width : undefined,
				});
			}, 300),
		[documentId],
	);

	const debouncedToggleSidebarOpen = useMemo(
		() =>
			debounce((isSidebarOpen: boolean, type: "sidebar" | "pdfChat") => {
				updateDocumentState({
					documentId,
					isSidebarOpen: type === "sidebar" ? isSidebarOpen : undefined,
					isPdfChatOpen: type === "pdfChat" ? isSidebarOpen : undefined,
				});
			}, 300),
		[documentId],
	);

	useEffect(() => {
		const unsubscribe = store.subscribe((state, prevState) => {
			if (state.layout.sidebarWidth !== prevState.layout.sidebarWidth) {
				debouncedUpdateWidth(state.layout.sidebarWidth, "sidebar");
			}

			if (state.layout.pdfChatWidth !== prevState.layout.pdfChatWidth) {
				debouncedUpdateWidth(state.layout.pdfChatWidth, "pdfChat");
			}
			if (state.layout.isSidebarOpen !== prevState.layout.isSidebarOpen) {
				debouncedToggleSidebarOpen(state.layout.isSidebarOpen, "sidebar");
			}
			if (state.layout.isPdfChatOpen !== prevState.layout.isPdfChatOpen) {
				debouncedToggleSidebarOpen(state.layout.isPdfChatOpen, "pdfChat");
			}
		});

		return () => {
			unsubscribe();
		};
	}, [debouncedUpdateWidth, debouncedToggleSidebarOpen, store]);

	return null;
}
