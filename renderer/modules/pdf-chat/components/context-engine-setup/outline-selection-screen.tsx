import { cn, ScrollArea } from "@renderer/modules/design-system";
import { usePdfReaderStore } from "@renderer/modules/pdf-reader/provider/pdf-reader-provider";
import type { PdfOutlineObject } from "@renderer/modules/pdf-reader/types/pdf.type";
import { ArrowLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

type OutlineSelectionScreenProps = {
	onBack: () => void;
	onConfirm: (outlineItem: PdfOutlineObject) => void;
};

export function OutlineSelectionScreen({
	onBack,
	onConfirm,
}: OutlineSelectionScreenProps) {
	const outline = usePdfReaderStore((state) => state.outline);
	const [selectedItem, setSelectedItem] = useState<PdfOutlineObject | null>(
		null,
	);

	const isEmpty = outline.length === 0;

	return (
		<div className="flex flex-col h-full px-3 py-4 gap-4">
			<button
				type="button"
				onClick={onBack}
				className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
			>
				<ArrowLeftIcon className="size-3.5" />
				Back
			</button>

			<div className="space-y-1">
				<p className="text-sm font-semibold">Outline Context</p>
				<p className="text-xs text-muted-foreground leading-relaxed">
					Select a chapter or section. The AI will use it as context for every
					response.
				</p>
			</div>

			<ScrollArea className="flex-1 min-h-0 -mx-1">
				{isEmpty ? (
					<div className="flex items-center justify-center py-8">
						<p className="text-xs text-muted-foreground">
							No outline available for this document.
						</p>
					</div>
				) : (
					<div className="px-1">
						{outline.map((item, index) => (
							<SelectableOutlineItem
								key={item.title ?? index}
								outline={item}
								depth={0}
								selectedItem={selectedItem}
								onSelect={setSelectedItem}
							/>
						))}
					</div>
				)}
			</ScrollArea>

			<div>
				<button
					type="button"
					disabled={!selectedItem}
					onClick={() => selectedItem && onConfirm(selectedItem)}
					className={cn(
						"w-full h-8 rounded-lg text-sm font-medium transition-all duration-150",
						"border border-transparent",
						selectedItem
							? "bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer"
							: "bg-muted/40 text-muted-foreground cursor-not-allowed opacity-50",
					)}
				>
					{selectedItem
						? `Use "${truncateTitle(selectedItem.title)}"`
						: "Select a chapter"}
				</button>
			</div>
		</div>
	);
}

type SelectableOutlineItemProps = {
	outline: PdfOutlineObject;
	depth: number;
	selectedItem: PdfOutlineObject | null;
	onSelect: (item: PdfOutlineObject) => void;
};

function SelectableOutlineItem({
	outline,
	depth,
	selectedItem,
	onSelect,
}: SelectableOutlineItemProps) {
	const [expanded, setExpanded] = useState(depth === 0);
	const children: PdfOutlineObject[] = outline.children ?? [];
	const hasChildren = children.length > 0;
	const isSelected = selectedItem === outline;

	return (
		<div>
			<div
				className={cn(
					"flex items-center gap-1 rounded-md py-1.5 pr-2 transition-colors duration-100",
					isSelected ? "bg-primary/15 text-primary" : "hover:bg-muted/60",
				)}
				style={{ paddingLeft: depth * 16 + 6 }}
			>
				{hasChildren ? (
					<button
						type="button"
						className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
						onClick={(e) => {
							e.stopPropagation();
							setExpanded((v) => !v);
						}}
					>
						<ChevronRightIcon
							className={cn(
								"size-3.5 transition-transform duration-150",
								expanded && "rotate-90",
							)}
						/>
					</button>
				) : (
					<span className="size-3.5 shrink-0" />
				)}

				<button
					type="button"
					className={cn(
						"flex-1 min-w-0 text-left text-xs leading-snug py-0.5 cursor-pointer",
						isSelected ? "font-medium" : "text-foreground/80",
					)}
					onClick={() => onSelect(outline)}
				>
					<span className="block truncate">{outline.title}</span>
				</button>
			</div>

			{hasChildren && expanded && (
				<div>
					{children.map((child, index) => (
						<SelectableOutlineItem
							key={child.title ?? index}
							outline={child}
							depth={depth + 1}
							selectedItem={selectedItem}
							onSelect={onSelect}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function truncateTitle(title: string | undefined, max = 24): string {
	if (!title) return "this section";
	return title.length > max ? `${title.slice(0, max)}…` : title;
}
