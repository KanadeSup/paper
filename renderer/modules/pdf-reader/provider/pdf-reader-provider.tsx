import type { PdfBookmarkObject } from "@embedpdf/models";
import type { DocumentState } from "@shared/document-state/types/document-state.type";
import { createContext, useContext, useRef, useState } from "react";
import { createStore, type StoreApi, useStore } from "zustand";
import { updateDocumentState } from "../ipc/document-state.ipc";
import type { LayoutState, PdfOutlineObject } from "../types/pdf.type";

export type PdfReaderProviderProps = {
	children: React.ReactNode;
	documentId: string;
};

type PdfReaderContext = {
	outline: PdfOutlineObject[];
	layout: LayoutState;
	actions: {
		setOutline: (outline: PdfBookmarkObject[]) => void;
		setLayout: (layout: LayoutState) => void;
		togglePdfChatOpen: (isPdfChatOpen?: boolean) => void;
		toggleSidebarOpen: (isSidebarOpen?: boolean) => void;
	};
};

const pdfReaderContext = createContext<StoreApi<PdfReaderContext> | null>(null);

export function PdfReaderProvider(props: PdfReaderProviderProps) {
	const { children, documentId } = props;
	const documentIdRef = useRef(documentId);
	documentIdRef.current = documentId;

	const [store] = useState(() =>
		createStore<PdfReaderContext>(() => ({
			outline: [],
			layout: {
				isPdfChatOpen: false,
				isSidebarOpen: false,
			},
			actions: {
				setOutline: (outline: PdfOutlineObject[]) => {
					store.setState({ outline });
				},
				setLayout: (layout: LayoutState) => {
					store.setState({ layout });
				},
				togglePdfChatOpen: (isPdfChatOpen?: boolean) => {
					const nextIsPdfChatOpen =
						isPdfChatOpen ?? !store.getState().layout.isPdfChatOpen;

					store.setState({
						layout: {
							...store.getState().layout,
							isPdfChatOpen: nextIsPdfChatOpen,
						},
					});

					void updateDocumentState({
						documentId: documentIdRef.current,
						isPdfChatOpen: nextIsPdfChatOpen,
					});
				},
				toggleSidebarOpen: (isSidebarOpen?: boolean) => {
					const nextIsSidebarOpen =
						isSidebarOpen ?? !store.getState().layout.isSidebarOpen;

					store.setState({
						layout: {
							...store.getState().layout,
							isSidebarOpen: nextIsSidebarOpen,
						},
					});

					updateDocumentState({
						documentId: documentIdRef.current,
						isSidebarOpen: nextIsSidebarOpen,
					});
				},
			},
		})),
	);

	return (
		<pdfReaderContext.Provider value={store}>
			{children}
		</pdfReaderContext.Provider>
	);
}

export const usePdfReaderStore = <T,>(
	selector: (state: PdfReaderContext) => T,
): T => {
	const store = useContext(pdfReaderContext);
	if (!store) {
		throw new Error(
			"usePdfReaderStore must be used within a PdfReaderProvider",
		);
	}
	return useStore(store, selector);
};
