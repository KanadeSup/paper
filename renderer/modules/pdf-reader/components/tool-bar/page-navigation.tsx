import { useScroll } from "@embedpdf/plugin-scroll/react";
import { cn, Input } from "@renderer/modules/design-system";
import { useState } from "react";

export type PageNavigationProps = {
	documentId: string;
};

export function PageNavigation({ documentId }: PageNavigationProps) {
	const { state, provides } = useScroll(documentId);
	const [inputValue, setInputValue] = useState<string | null>(null);

	const displayValue =
		inputValue !== null ? inputValue : String(state.currentPage);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			commit(displayValue);
			e.currentTarget.blur();
		}
		if (e.key === "Escape") {
			setInputValue(null);
			e.currentTarget.blur();
		}
	};

	const commit = (raw: string) => {
		const page = parseInt(raw, 10);
		if (!Number.isNaN(page) && page >= 1 && page <= state.totalPages) {
			provides?.scrollToPage({ pageNumber: page, behavior: "smooth" });
		}
		setInputValue(null);
	};

	return (
		<div className="flex items-center gap-1.5">
			<Input
				type="text"
				inputMode="numeric"
				value={displayValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				onFocus={(e) => {
					setInputValue(String(state.currentPage));
					e.target.select();
				}}
				onBlur={() => setInputValue(null)}
				className={cn("w-12 rounded-md text-center tabular-nums", "px-1")}
			/>
			<span className="text-muted-foreground tabular-nums">
				/ {state.totalPages}
			</span>
		</div>
	);
}
