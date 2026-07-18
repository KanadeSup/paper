import { useScroll } from "@embedpdf/plugin-scroll/react";
import { ScrollArea } from "@renderer/modules/design-system";
import { useCallback } from "react";
import { usePdfReaderStore } from "../../provider/pdf-reader-provider";
import { PdfOutlineItem } from "./pdf-outline-item";

type PdfOutlineProps = {
	documentId: string;
};

export function PdfOutline({ documentId }: PdfOutlineProps) {
	const { provides: scrollProvides } = useScroll(documentId);
	const { state: scrollState } = useScroll(documentId);
	const currentPage = scrollState.currentPage;
	const pdfReaderOutline = usePdfReaderStore(
		(state) => state.metadata?.outlines,
	);
	const handleNavigate = useCallback(
		(pageNumber: number) => {
			scrollProvides?.scrollToPage({
				pageNumber,
				behavior: "auto",
			});
		},
		[scrollProvides],
	);

	return (
		<ScrollArea className="min-h-0 flex-1 pr-3">
			<div>
				{pdfReaderOutline?.map((outline, index) => (
					<PdfOutlineItem
						currentPage={currentPage}
						key={outline.title}
						itemKey={String(index)}
						outline={outline}
						depth={0}
						onNavigate={handleNavigate}
					/>
				))}
			</div>
		</ScrollArea>
	);
}
