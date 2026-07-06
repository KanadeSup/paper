import { cn } from "@renderer/modules/design-system";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import type { PdfOutlineObject } from "../../types/pdf.type";
import { getBookmarkPageNumber } from "../../utils/pdf.utils";

export type PdfOutlineItemProps = {
	outline: PdfOutlineObject;
	depth: number;
	itemKey: string;
	currentPage: number;
	onNavigate: (pageNumber: number) => void;
};

export function PdfOutlineItem({
	outline,
	depth,
	itemKey,
	currentPage,
	onNavigate,
}: PdfOutlineItemProps) {
	const [expanded, setExpanded] = useState(false);
	const children: PdfOutlineObject[] =
		outline.children?.map((child) => ({
			...child,
			targetPage: getBookmarkPageNumber(child),
		})) ?? [];
	const hasChildren = children.length > 0;
	const pageNumber = getBookmarkPageNumber(outline);
	const isInCurrentPage =
		outline.startPage &&
		outline.endPage &&
		currentPage >= outline.startPage &&
		currentPage <= outline.endPage;

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
					className={cn(
						"min-w-0 text-left text-sm",
						"cursor-pointer",
						isInCurrentPage && "text-primary",
					)}
					onClick={handleNavigate}
				>
					{outline.title}
				</button>
			</div>

			{hasChildren && expanded && (
				<div>
					{children.map((child, index) => (
						<PdfOutlineItem
							key={child.title}
							currentPage={currentPage}
							itemKey={`${itemKey}-${index}`}
							outline={child}
							depth={depth + 1}
							onNavigate={onNavigate}
						/>
					))}
				</div>
			)}
		</div>
	);
}
