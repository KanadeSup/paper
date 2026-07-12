import { useZoom } from "@embedpdf/plugin-zoom/react";
import { useEffect, useRef } from "react";
import { useReaderStateRestorer } from "../reader-state-restorer/reader-state-restorer";

export type ReaderZoomRestoreProps = {
	documentId: string;
};

export function ReaderZoomRestore(props: ReaderZoomRestoreProps) {
	const { documentId } = props;
	const { zoomLevel } = useReaderStateRestorer();
	const { provides } = useZoom(documentId);
	const isFinished = useRef(false);
	useEffect(() => {
		if (!provides) return;
		if (isFinished.current) return;
		provides.requestZoom(zoomLevel);
		isFinished.current = true;
	}, [provides, zoomLevel]);

	return null;
}
