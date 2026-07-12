import { useZoom } from "@embedpdf/plugin-zoom/react";
import type { DocumentZoomLevel } from "@shared/document-state/types/document-state.type";
import debounce from "lodash/debounce";
import { useEffect, useMemo } from "react";
import { useZoomGesture } from "../../hooks/use-zoom-gesture";
import { updateDocumentState } from "../../ipc/document-state.ipc";

export type ZoomProps = {
	documentId: string;
	children: React.ReactNode;
};

export function Zoom(props: ZoomProps) {
	const { documentId, children } = props;
	const { elementRef } = useZoomGesture(documentId);
	const { state: zoomState } = useZoom(documentId);

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
		debouncedUpdateDocumentState(documentId, zoomState.zoomLevel);
	}, [debouncedUpdateDocumentState, documentId, zoomState.zoomLevel]);

	return (
		<div
			ref={elementRef}
			style={{
				display: "inline-block",
				overflow: "visible",
				boxSizing: "border-box",
			}}
		>
			{children}
		</div>
	);
}
