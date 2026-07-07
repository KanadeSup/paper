import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ContextEngine } from "../types/context-engine.type";

export type DefaultContextState = {
	contextEngine: ContextEngine | null;
	actions: {
		setContextEngine: (contextEngine: ContextEngine) => void;
	};
};

const useDefaultContext = create<DefaultContextState>()(
	persist(
		(set) => ({
			contextEngine: null,
			actions: {
				setContextEngine: (contextEngine) => set({ contextEngine }),
			},
		}),
		{
			name: "default-context",
			storage: createJSONStorage(() => localStorage),

			// Exclude actions from the persisted state
			partialize: ({ actions, ...state }) => state,
		},
	),
);

export default useDefaultContext;
