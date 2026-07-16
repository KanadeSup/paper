import { useScrollCapability } from "@embedpdf/plugin-scroll/react";
import { debounce } from "lodash";
import { useEffect, useMemo } from "react";
import { updateDocumentState } from "../../ipc/document-state.ipc";
import { useReaderStateRestorer } from "./persisted-reader-state-provider";

export type ReaderScrollPersistanceProps = {
	documentId: string;
};

export function ReaderScrollPersistance(props: ReaderScrollPersistanceProps) {
	const { documentId } = props;
	const { provides: scrollProvides } = useScrollCapability();
	const currentPage = useReaderStateRestorer((state) => state.currentPage);
	const debouncedUpdateDocumentState = useMemo(
		() =>
			debounce((documentId: string, pageNumber: number) => {
				updateDocumentState({
					documentId,
					currentPage: pageNumber,
				});
			}, 300),
		[],
	);
	useEffect(() => {
		if (!scrollProvides) return;
		const layoutReadyUnsubscribe = scrollProvides.onLayoutReady((_) => {
			scrollProvides.scrollToPage({
				pageNumber: currentPage,
				behavior: "instant",
			});
		});
		const scrollUnsubscribe = scrollProvides.onScroll((event) => {
			debouncedUpdateDocumentState(documentId, event.metrics.currentPage);
		});
		return () => {
			layoutReadyUnsubscribe();
			scrollUnsubscribe();
		};
	}, [scrollProvides, debouncedUpdateDocumentState, documentId, currentPage]);
	return null;
}
