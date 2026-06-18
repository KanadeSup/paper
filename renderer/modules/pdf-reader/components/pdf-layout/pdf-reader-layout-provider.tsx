import { createContext, useContext, useState } from "react";
import { createStore, type StoreApi, useStore } from "zustand";

const pdfReaderLayoutContext =
	createContext<StoreApi<PdfReaderLayoutContext> | null>(null);
export type PdfReaderLayoutProviderProps = {
	children: React.ReactNode;
};

type PdfReaderLayoutContext = {
	isSidebarOpen: boolean;
	isSidebarRightOpen: boolean;
	actions: {
		toggleSidebar: (open?: boolean) => void;
		toggleSidebarRight: (open?: boolean) => void;
	};
};

export function PdfReaderLayoutProvider(props: PdfReaderLayoutProviderProps) {
	const [store] = useState(() =>
		createStore<PdfReaderLayoutContext>(() => ({
			isSidebarOpen: true,
			isSidebarRightOpen: true,
			actions: {
				toggleSidebar: (open?: boolean) => {
					store.setState({
						isSidebarOpen: open ?? !store.getState().isSidebarOpen,
					});
				},
				toggleSidebarRight: (open?: boolean) => {
					store.setState({
						isSidebarRightOpen: open ?? !store.getState().isSidebarRightOpen,
					});
				},
			},
		})),
	);

	return (
		<pdfReaderLayoutContext.Provider value={store}>
			{props.children}
		</pdfReaderLayoutContext.Provider>
	);
}

export const usePdfReaderLayoutStore = <T,>(
	selector: (state: PdfReaderLayoutContext) => T,
): T => {
	const store = useContext(pdfReaderLayoutContext);
	if (!store) {
		throw new Error(
			"usePdfReaderLayoutStore must be used within a PdfReaderLayoutProvider",
		);
	}
	return useStore(store, selector);
};
