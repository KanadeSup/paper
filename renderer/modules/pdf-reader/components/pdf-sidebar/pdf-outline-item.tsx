import type { PdfBookmarkObject } from "@embedpdf/models";
import { cn } from "@renderer/modules/design-system";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { getBookmarkPageNumber } from "./get-bookmark-page";

type PdfOutlineItemProps = {
	bookmark: PdfBookmarkObject;
	depth: number;
	itemKey: string;
	onNavigate: (pageNumber: number) => void;
};

export function PdfOutlineItem({
	bookmark,
	depth,
	itemKey,
	onNavigate,
}: PdfOutlineItemProps) {
	const [expanded, setExpanded] = useState(false);
	const children = bookmark.children ?? [];
	const hasChildren = children.length > 0;
	const pageNumber = getBookmarkPageNumber(bookmark);

	const handleNavigate = () => {
		if (pageNumber === null) {
			return;
		}

		onNavigate(pageNumber);
	};

	const handleToggleExpand = (event: React.MouseEvent) => {
		event.stopPropagation();
		setExpanded((value) => !value);
	};

	return (
		<div className="font-medium">
			<div
				className={cn(
					"flex items-center gap-1 rounded-md hover:bg-muted/60 py-1.5",
				)}
				style={{ paddingLeft: depth * 18 + 8 }}
			>
				{hasChildren && (
					<button
						type="button"
						className={cn("text-muted-foreground", "hover:text-foreground")}
						onClick={handleToggleExpand}
						tabIndex={hasChildren ? 0 : -1}
					>
						<ChevronRight
							className={cn(
								"size-3.5 transition-transform duration-150",
								expanded && "rotate-90",
							)}
						/>
					</button>
				)}
				<button
					type="button"
					className={cn("min-w-0 text-left text-sm", "cursor-pointer")}
					onClick={handleNavigate}
				>
					{bookmark.title}
				</button>
			</div>

			{hasChildren && expanded && (
				<div>
					{children.map((child, index) => (
						<PdfOutlineItem
							key={child.title}
							itemKey={`${itemKey}-${index}`}
							bookmark={child}
							depth={depth + 1}
							onNavigate={onNavigate}
						/>
					))}
				</div>
			)}
		</div>
	);
}
