import { useCapability } from "@embedpdf/core/react";
import type { ViewportPlugin } from "@embedpdf/plugin-viewport";
import { useViewportElement } from "@embedpdf/plugin-viewport/react";
import {
	useZoomCapability,
	type ZoomCapability,
} from "@embedpdf/plugin-zoom/react";
import { useLayoutEffect, useRef } from "react";

export interface ZoomGestureDeps {
	element: HTMLDivElement;
	/** Viewport container element for attaching events */
	container: HTMLElement;
	documentId: string;
	zoomProvides: ZoomCapability;
	/** Viewport gap in pixels (default: 0) */
	viewportGap?: number;
}

export function useZoomGesture(documentId: string) {
	const elementRef = useRef<HTMLDivElement>(null);
	const { provides: viewportProvides } =
		useCapability<ViewportPlugin>("viewport");
	const { provides: zoomProvides } = useZoomCapability();
	const viewportElementRef = useViewportElement();

	useLayoutEffect(() => {
		const element = elementRef.current;
		const container = viewportElementRef?.current;

		if (!element || !container || !zoomProvides) return;

		return setupZoomGestures({
			element,
			container,
			documentId,
			zoomProvides,
			viewportGap: viewportProvides?.getViewportGap() || 0,
		});
	}, [viewportElementRef, zoomProvides, viewportProvides, documentId]);

	return { elementRef };
}

function setupZoomGestures({
	element,
	container,
	documentId,
	zoomProvides,
	viewportGap = 0,
}: ZoomGestureDeps) {
	if (typeof window === "undefined") {
		return () => {};
	}

	const zoomScope = zoomProvides.forDocument(documentId);
	const getState = () => zoomScope.getState();

	// Shared state
	let initialZoom = 0;
	let currentScale = 1;

	// Wheel state
	const ZOOM_STEP = 0.5;
	const ZOOM_THRESHOLD = 150;
	let wheelZoomTimeout: ReturnType<typeof setTimeout> | null = null;
	let accumulatedWheelScale = 1;
	let scrollAmount = 0;

	// Gesture state
	let initialElementWidth = 0;
	let initialElementHeight = 0;
	let initialElementLeft = 0;
	let initialElementTop = 0;

	// Container Dimensions (Bounding Box)
	let containerRectWidth = 0;
	let containerRectHeight = 0;

	// Layout Dimensions (Client Box from Metrics)
	let layoutWidth = 0;
	let layoutCenterX = 0;

	let pointerLocalY = 0;
	let pointerContainerX = 0;
	let pointerContainerY = 0;

	let currentGap = 0;
	let pivotLocalX = 0;

	const clamp = (val: number, min: number, max: number) =>
		Math.min(Math.max(val, min), max);

	// --- Margin calculation ---
	const updateMargin = () => {
		console.log("container", container.clientWidth, viewportGap);
		const availableWidth = container.clientWidth - 2 * viewportGap;
		const elementWidth = element.offsetWidth;

		const newMargin =
			elementWidth < availableWidth ? (availableWidth - elementWidth) / 2 : 0;
		element.style.marginLeft = `${newMargin}px`;
	};

	const calculateTransform = (scale: number) => {
		const finalWidth = initialElementWidth * scale;
		const finalHeight = initialElementHeight * scale;

		let ty = pointerLocalY * (1 - scale);

		const targetX = layoutCenterX - finalWidth / 2;
		const txCenter = targetX - initialElementLeft;
		const txMouse =
			pointerContainerX - pivotLocalX * scale - initialElementLeft;

		const overflow = Math.max(0, finalWidth - layoutWidth);
		const blendRange = layoutWidth * 0.3;
		const blend = Math.min(1, overflow / blendRange);

		let tx = txCenter + (txMouse - txCenter) * blend;

		const safeHeight = containerRectHeight - currentGap * 2;
		if (finalHeight > safeHeight) {
			const currentTop = initialElementTop + ty;
			const maxTop = currentGap;
			const minTop = containerRectHeight - currentGap - finalHeight;
			const constrainedTop = clamp(currentTop, minTop, maxTop);
			ty = constrainedTop - initialElementTop;
		}

		const safeWidth = containerRectWidth - currentGap * 2;
		if (finalWidth > safeWidth) {
			const currentLeft = initialElementLeft + tx;
			const maxLeft = currentGap;
			const minLeft = containerRectWidth - currentGap - finalWidth;
			const constrainedLeft = clamp(currentLeft, minLeft, maxLeft);
			tx = constrainedLeft - initialElementLeft;
		}

		return { tx, ty, blend, finalWidth };
	};

	const updateTransform = (scale: number) => {
		currentScale = scale;
		const { tx, ty } = calculateTransform(scale);
		element.style.transformOrigin = "0 0";
		element.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
	};

	const resetTransform = () => {
		element.style.transform = "none";
		element.style.transformOrigin = "0 0";
		currentScale = 1;
	};

	const commitZoom = () => {
		const { tx, finalWidth } = calculateTransform(currentScale);
		const delta = (currentScale - 1) * initialZoom;

		let anchorX: number;
		const anchorY: number = pointerContainerY;

		if (finalWidth <= layoutWidth) {
			anchorX = layoutCenterX;
		} else {
			const scaleDiff = 1 - currentScale;
			anchorX =
				Math.abs(scaleDiff) > 0.001
					? initialElementLeft + tx / scaleDiff
					: pointerContainerX;
		}

		zoomScope.requestZoomBy(delta, { vx: anchorX, vy: anchorY });
		resetTransform();
		initialZoom = 0;
	};

	const initializeGestureState = (clientX: number, clientY: number) => {
		const containerRect = container.getBoundingClientRect();
		const innerRect = element.getBoundingClientRect();

		currentGap = viewportGap;
		initialElementWidth = innerRect.width;
		initialElementHeight = innerRect.height;
		initialElementLeft = innerRect.left - containerRect.left;
		initialElementTop = innerRect.top - containerRect.top;

		containerRectWidth = containerRect.width;
		containerRectHeight = containerRect.height;

		// Layout dimensions from container's client area
		layoutWidth = container.clientWidth;
		layoutCenterX = container.clientLeft + layoutWidth / 2;

		const rawPointerLocalX = clientX - innerRect.left;
		pointerLocalY = clientY - innerRect.top;
		pointerContainerX = clientX - containerRect.left;
		pointerContainerY = clientY - containerRect.top;

		if (initialElementWidth < layoutWidth) {
			pivotLocalX = (pointerContainerX * initialElementWidth) / layoutWidth;
		} else {
			pivotLocalX = rawPointerLocalX;
		}
	};

	// --- Handlers ---
	const handleWheel = (e: WheelEvent) => {
		if (!e.ctrlKey && !e.metaKey) return;
		e.preventDefault();

		if (wheelZoomTimeout === null) {
			initialZoom = getState().currentZoomLevel;
			accumulatedWheelScale = 1;
			initializeGestureState(e.clientX, e.clientY);
		} else {
			clearTimeout(wheelZoomTimeout);
		}

		const isScrollDirectionChanged =
			Math.sign(e.deltaY) !== Math.sign(scrollAmount);
		scrollAmount = isScrollDirectionChanged
			? e.deltaY
			: scrollAmount + e.deltaY;

		if (Math.abs(scrollAmount) > ZOOM_THRESHOLD) {
			accumulatedWheelScale += ZOOM_STEP * Math.sign(scrollAmount);
			console.log(accumulatedWheelScale);
			updateTransform(accumulatedWheelScale);
			scrollAmount = 0;
			wheelZoomTimeout = setTimeout(() => {
				wheelZoomTimeout = null;
				commitZoom();
				accumulatedWheelScale = 1;
			}, 1000);
			return;
		}
	};

	// Subscribe to zoom changes to update margin
	const unsubZoom = zoomScope.onStateChange(() => updateMargin());

	// Use ResizeObserver to update margin when element or container size changes
	const resizeObserver = new ResizeObserver(() => updateMargin());
	resizeObserver.observe(element);
	resizeObserver.observe(container);

	// Initial margin calculation
	updateMargin();

	// Attach events to the viewport container for better UX
	// (gestures work anywhere in viewport, not just on the PDF)
	container.addEventListener("wheel", handleWheel, { passive: false });

	return () => {
		container.removeEventListener("wheel", handleWheel);
		if (wheelZoomTimeout) {
			clearTimeout(wheelZoomTimeout);
		}
		unsubZoom();
		resizeObserver.disconnect();
		resetTransform();
		element.style.marginLeft = "";
	};
}
