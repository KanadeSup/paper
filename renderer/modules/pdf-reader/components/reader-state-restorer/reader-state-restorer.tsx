import { type ZoomLevel, ZoomMode } from "@embedpdf/plugin-zoom/react";
import type { DocumentZoomLevel } from "@shared/document-state/types/document-state.type";
import Logger from "electron-log/renderer.js";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { createStore, type StoreApi, useStore } from "zustand";
import { getDocumentState } from "../../ipc/document-state.ipc";

const readerStateRestorerContext =
	createContext<StoreApi<ReaderStateRestorerContext> | null>(null);

type ReaderStateRestorerContext = {
	isSidebarOpen: boolean;
	isPdfChatOpen: boolean;
	zoomLevel: ZoomLevel;
	currentPage: number;
};

export type ReaderStateRestorerProps = {
	documentId: string;
	children?: React.ReactNode;
};

export function ReaderStateRestorer(props: ReaderStateRestorerProps) {
	const { documentId, children } = props;
	const [isLoading, setIsLoading] = useState(true);

	const [store] = useState(() =>
		createStore<ReaderStateRestorerContext>(() => ({
			isSidebarOpen: false,
			isPdfChatOpen: false,
			zoomLevel: ZoomMode.FitPage,
			currentPage: 1,
		})),
	);

	const loadDocumentState = useCallback(async () => {
		const res = await getDocumentState(documentId);
		if (!res.success) {
			Logger.error(`Failed to load document state for document ${documentId}`);
			Logger.error(res.errorMessage ?? "Unknown error");
			return;
		}
		if (!res.data) return;
		const documentState = res.data;

		store.setState({
			isSidebarOpen: documentState.isSidebarOpen,
			isPdfChatOpen: documentState.isPdfChatOpen,
			zoomLevel: toEmbedPdfZoomLevel(documentState.zoomLevel),
			currentPage: documentState.currentPage,
		});
	}, [documentId, store]);

	useEffect(() => {
		loadDocumentState().finally(() => {
			setIsLoading(false);
		});
	}, [loadDocumentState]);

	if (isLoading) return null;

	return (
		<readerStateRestorerContext.Provider value={store}>
			{children}
		</readerStateRestorerContext.Provider>
	);
}

export const useReaderStateRestorer = <T,>(
	selector: (state: ReaderStateRestorerContext) => T,
): T => {
	const store = useContext(readerStateRestorerContext);
	if (!store) {
		throw new Error(
			"useReaderStateRestorer must be used within a ReaderStateRestorer",
		);
	}
	return useStore(store, selector);
};

function toEmbedPdfZoomLevel(zoomLevel: DocumentZoomLevel): ZoomLevel {
	switch (zoomLevel) {
		case "automatic":
			return ZoomMode.Automatic;
		case "fit-width":
			return ZoomMode.FitWidth;
		case "fit-page":
			return ZoomMode.FitPage;
		default:
			return zoomLevel;
	}
}
