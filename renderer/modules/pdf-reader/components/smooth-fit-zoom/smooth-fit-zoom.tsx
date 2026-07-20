import { useScrollCapability } from "@embedpdf/plugin-scroll/react";
import { useViewportCapability } from "@embedpdf/plugin-viewport/react";
import { useZoomCapability, ZoomMode } from "@embedpdf/plugin-zoom/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

type Props = {
	documentId: string;
	children: ReactNode;
};
function isAutoMode(level: ZoomMode | number): level is ZoomMode {
	return (
		level === ZoomMode.FitWidth ||
		level === ZoomMode.FitPage ||
		level === ZoomMode.Automatic
	);
}

export function SmoothFitZoom({ documentId, children }: Props) {
	const { provides: zoom } = useZoomCapability();
	const { provides: viewport } = useViewportCapability();
	const { provides: scroll } = useScrollCapability();
	const [preview, setPreview] = useState({ scale: 1, tx: 0, ty: 0 });

	const { scale, tx, ty } = preview;
	const active = scale !== 1;

	useEffect(() => {
		if (!zoom || !viewport || !scroll) return;
		return viewport.onViewportResize((event) => {
			if (event.documentId !== documentId) return;

			const zoomState = zoom.forDocument(documentId).getState();
			if (!isAutoMode(zoomState.zoomLevel)) {
				setPreview({ scale: 1, tx: 0, ty: 0 });
				return;
			}

			const spreads = scroll
				.forDocument(documentId)
				.getSpreadPagesWithRotatedSize();
			const ideal = computeIdealZoom(
				zoomState.zoomLevel,
				event.metrics.clientWidth,
				event.metrics.clientHeight,
				viewport.getViewportGap(),
				scroll.getPageGap(),
				spreads,
			);
			if (!ideal || zoomState.currentZoomLevel <= 0) {
				setPreview({ scale: 1, tx: 0, ty: 0 });
				return;
			}
			const s = ideal / zoomState.currentZoomLevel;
			const { scrollLeft, scrollTop } = event.metrics;

			setPreview({
				scale: s,
				tx: scrollLeft * (1 - s),
				ty: scrollTop * (1 - s),
			});
		});
	}, [zoom, viewport, scroll, documentId]);

	useEffect(() => {
		if (!zoom) return;
		return zoom.forDocument(documentId).onZoomChange(() => {
			setPreview({ scale: 1, tx: 0, ty: 0 });
		});
	}, [zoom, documentId]);

	return (
		<div
			style={{
				display: "inline-block",
				transformOrigin: "0 0",
				transform: active
					? `translate(${tx}px, ${ty}px) scale(${scale})`
					: undefined,
				willChange: active ? "transform" : undefined,
			}}
		>
			{children}
		</div>
	);
}

/** Same formulas as ZoomPlugin.computeZoomForMode */
function computeIdealZoom(
	mode: ZoomMode,
	clientWidth: number,
	clientHeight: number,
	viewportGap: number,
	pageGap: number,
	spreads: { rotatedSize: { width: number; height: number } }[][],
): number | null {
	const availableWidth = clientWidth - 2 * viewportGap;
	const availableHeight = clientHeight - 2 * viewportGap;
	if (availableWidth <= 0 || availableHeight <= 0 || !spreads.length)
		return null;
	let maxContentW = 0;
	let maxContentH = 0;
	for (const spread of spreads) {
		const contentW = spread.reduce(
			(sum, p, i) => sum + p.rotatedSize.width + (i ? pageGap : 0),
			0,
		);
		const contentH = Math.max(...spread.map((p) => p.rotatedSize.height));
		maxContentW = Math.max(maxContentW, contentW);
		maxContentH = Math.max(maxContentH, contentH);
	}
	if (maxContentW <= 0 || maxContentH <= 0) return null;
	switch (mode) {
		case ZoomMode.FitWidth:
			return availableWidth / maxContentW;
		case ZoomMode.FitPage:
			return Math.min(
				availableWidth / maxContentW,
				availableHeight / maxContentH,
			);
		case ZoomMode.Automatic:
			return Math.min(availableWidth / maxContentW, 1);
		default:
			return null;
	}
}
