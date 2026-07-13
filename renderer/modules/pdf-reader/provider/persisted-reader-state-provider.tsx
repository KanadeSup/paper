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
import { getDocumentState } from "../ipc/document-state.ipc";

/** Context */
type PersistedReaderStateContext = {
	isSidebarOpen: boolean;
	isPdfChatOpen: boolean;
	zoomLevel: ZoomLevel;
	currentPage: number;
};

const readerStateRestorerContext =
	createContext<StoreApi<PersistedReaderStateContext> | null>(null);

/** Provider component */
export type PersistedReaderStateProviderProps = {
	documentId: string;
	children?: React.ReactNode;
};

export function PersistedReaderStateProvider(
	props: PersistedReaderStateProviderProps,
) {
	const { documentId, children } = props;
	const [isLoading, setIsLoading] = useState(true);

	const [store] = useState(() =>
		createStore<PersistedReaderStateContext>(() => ({
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

/** Hook */
export const useReaderStateRestorer = <T,>(
	selector: (state: PersistedReaderStateContext) => T,
): T => {
	const store = useContext(readerStateRestorerContext);
	if (!store) {
		throw new Error(
			"useReaderStateRestorer must be used within a PersistedReaderStateProvider",
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
