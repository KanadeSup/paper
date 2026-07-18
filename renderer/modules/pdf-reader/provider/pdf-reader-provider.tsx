import { createContext, useContext, useState } from "react";
import { createStore, type StoreApi, useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { useReaderStateRestorer } from "../components/persistance/persisted-reader-state-provider";
import type { PdfMetadata } from "../types/pdf.type";

export type LayoutState = {
	isPdfChatOpen: boolean;
	isSidebarOpen: boolean;
	sidebarWidth: number;
	pdfChatWidth: number;
};

type PdfReaderContext = {
	layout: LayoutState;
	metadata: PdfMetadata | null;
	currentPage: number | null;
	actions: {
		setLayout: (layout: LayoutState) => void;
		setMetadata: (metadata: PdfMetadata) => void;
		setCurrentPage: (currentPage: number) => void;
		updateLayout: (layout: Partial<LayoutState>) => void;
		togglePdfChatOpen: (isPdfChatOpen?: boolean) => void;
		toggleSidebarOpen: (isSidebarOpen?: boolean) => void;
		setSidebarWidth: (sidebarWidth: number) => void;
		setPdfChatWidth: (pdfChatWidth: number) => void;
	};
};

const pdfReaderContext = createContext<StoreApi<PdfReaderContext> | null>(null);

export type PdfReaderProviderProps = {
	children: React.ReactNode;
};

export function PdfReaderProvider(props: PdfReaderProviderProps) {
	const { children } = props;
	const { isPdfChatOpen, isSidebarOpen, sidebarWidth, pdfChatWidth } =
		useReaderStateRestorer(
			useShallow((state) => ({
				isPdfChatOpen: state.isPdfChatOpen,
				isSidebarOpen: state.isSidebarOpen,
				sidebarWidth: state.sidebarWidth,
				pdfChatWidth: state.pdfChatWidth,
			})),
		);

	const [store] = useState(() =>
		createStore<PdfReaderContext>(() => ({
			metadata: null,
			currentPage: null,
			title: null,
			layout: {
				isPdfChatOpen,
				isSidebarOpen,
				sidebarWidth: sidebarWidth ?? 280,
				pdfChatWidth: pdfChatWidth ?? 280,
			},
			actions: {
				setMetadata: (metadata: PdfMetadata) => {
					store.setState({ metadata });
				},
				setLayout: (layout: LayoutState) => {
					store.setState({ layout });
				},
				setCurrentPage: (currentPage: number) => {
					store.setState({ currentPage });
				},
				updateLayout: (layout: Partial<LayoutState>) => {
					store.setState({
						layout: {
							...store.getState().layout,
							...layout,
						},
					});
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
				},
				setSidebarWidth: (sidebarWidth: number) => {
					store.setState({
						layout: { ...store.getState().layout, sidebarWidth },
					});
				},
				setPdfChatWidth: (pdfChatWidth: number) => {
					store.setState({
						layout: { ...store.getState().layout, pdfChatWidth },
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

export const usePdfReaderStoreAPI = () => {
	const store = useContext(pdfReaderContext);
	if (!store) {
		throw new Error(
			"usePdfReaderStoreActions must be used within a PdfReaderProvider",
		);
	}
	return store;
};
