import { useState } from "react";
import type { ContextEngine } from "../../types/context-engine.type";
import { ContextSelectionCards } from "./context-selection-cards";
import { OutlineSelectionScreen } from "./outline-selection-screen";
import { RagConfigScreen } from "./rag-config-screen";

type Screen = "context-selection" | "rag-config" | "outline-selection";

export type ContextEngineSetupProps = {
	onConfirm?: (contextEngine: ContextEngine) => void;
};

export function ContextEngineSetup(props: ContextEngineSetupProps) {
	const { onConfirm } = props;

	const [screen, setScreen] = useState<Screen>("context-selection");

	const handleConfirm = (contextEngine: ContextEngine) => {
		onConfirm?.(contextEngine);
	};

	if (screen === "context-selection") {
		return (
			<ContextSelectionCards
				onSelectRag={() => setScreen("rag-config")}
				onSelectOutline={() => setScreen("outline-selection")}
			/>
		);
	}

	if (screen === "rag-config") {
		return (
			<RagConfigScreen
				onBack={() => setScreen("context-selection")}
				onConfirm={(engine) => handleConfirm({ type: "rag", engine })}
			/>
		);
	}

	if (screen === "outline-selection") {
		return (
			<OutlineSelectionScreen
				onBack={() => setScreen("context-selection")}
				onConfirm={(outlineItem) =>
					handleConfirm({ type: "outline", outlineItem })
				}
			/>
		);
	}

	return null;
}
