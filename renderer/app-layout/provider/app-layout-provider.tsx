import { createContext, useContext, useState } from "react";
import { createStore, type StoreApi, useStore } from "zustand";

type AppLayoutContext = {
	isSidebarOpen: boolean;
	actions: {
		toggleSidebar: (open?: boolean) => void;
	};
};

const appLayoutContext = createContext<StoreApi<AppLayoutContext> | null>(null);

export type AppLayoutProviderProps = {
	children: React.ReactNode;
};

export function AppLayoutProvider(props: AppLayoutProviderProps) {
	const [store] = useState(() =>
		createStore<AppLayoutContext>(() => ({
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
		<appLayoutContext.Provider value={store}>
			{props.children}
		</appLayoutContext.Provider>
	);
}

export const useAppLayoutStore = <T,>(
	selector: (state: AppLayoutContext) => T,
): T => {
	const store = useContext(appLayoutContext);
	if (!store) {
		throw new Error(
			"useAppLayoutStore must be used within an AppLayoutProvider",
		);
	}
	return useStore(store, selector);
};
