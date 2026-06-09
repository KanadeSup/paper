import { createContext, useContext, useState } from "react";
import { createStore, type StoreApi, useStore } from "zustand";

export type PdfReaderProviderProps = {
	children: React.ReactNode;
};

type PdfReaderContext = {
	isSidebarOpen: boolean;
	actions: {
		toggleSidebar: (open?: boolean) => void;
	};
};

const pdfReaderContext = createContext<StoreApi<PdfReaderContext> | null>(null);

export function PdfReaderProvider(props: PdfReaderProviderProps) {
	const { children } = props;

	const [store] = useState(() =>
		createStore<PdfReaderContext>(() => ({
			isSidebarOpen: true,
			actions: {
				toggleSidebar: (open?: boolean) => {
					store.setState({
						isSidebarOpen: open ?? !store.getState().isSidebarOpen,
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
