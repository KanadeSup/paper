import { useZoomCapability } from "@embedpdf/plugin-zoom/react";
import type { DocumentZoomLevel } from "@shared/document-state/types/document-state.type";
import { debounce } from "lodash";
import { useEffect, useMemo } from "react";
import { updateDocumentState } from "../../ipc/document-state.ipc";
import { useReaderStateRestorer } from "../../provider/persisted-reader-state-provider";

export type ReaderZoomPersistanceProps = {
	documentId: string;
};
export function ReaderZoomPersistance(props: ReaderZoomPersistanceProps) {
	const { documentId } = props;
	const zoomLevel = useReaderStateRestorer((state) => state.zoomLevel);
	const { provides } = useZoomCapability();

	const debouncedUpdateDocumentState = useMemo(
		() =>
			debounce((documentId: string, zoomLevel: DocumentZoomLevel) => {
				updateDocumentState({
					documentId,
					zoomLevel,
				});
			}, 1000),
		[],
	);

	useEffect(() => {
		if (!provides) return;
		provides.requestZoom(zoomLevel);
		provides.onZoomChange((zoomLevel) => {
			debouncedUpdateDocumentState(documentId, zoomLevel.level);
		});
	}, [provides, zoomLevel, debouncedUpdateDocumentState, documentId]);

	return null;
}
