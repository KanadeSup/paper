import type { PdfBookmarkObject } from "@embedpdf/models";
import { createContext, useContext, useState } from "react";
import { createStore, type StoreApi, useStore } from "zustand";
import type { PdfOutlineObject } from "../types/pdf.type";

export type PdfReaderProviderProps = {
	children: React.ReactNode;
};

type PdfReaderContext = {
	outline: PdfOutlineObject[];
	actions: {
		setOutline: (outline: PdfBookmarkObject[]) => void;
	};
};

const pdfReaderContext = createContext<StoreApi<PdfReaderContext> | null>(null);

export function PdfReaderProvider(props: PdfReaderProviderProps) {
	const { children } = props;

	const [store] = useState(() =>
		createStore<PdfReaderContext>(() => ({
			outline: [],
			actions: {
				setOutline: (outline: PdfOutlineObject[]) => {
					store.setState({ outline });
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
