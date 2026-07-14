import type { SelectionSelectionMenuProps } from "@embedpdf/plugin-selection/react";
import { cn } from "@renderer/modules/design-system";
import type { MenuAction } from "@renderer/modules/setting-menu-selection/types/menu-action.type";
import { AnimatePresence, motion } from "motion/react";
import { type SyntheticEvent, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGenerateTextWithPlaceholder } from "../../hooks/use-generate-text-with-placeholder";
import { GeneratedResult } from "./generated-result";
import { MenuActions } from "./menu-actions";
import {
	type AnchorRect,
	clampPopupPosition,
	type PopupCoords,
	RESULT_MAX_HEIGHT,
	RESULT_MAX_WIDTH,
	RESULT_MIN_HEIGHT,
	RESULT_MIN_WIDTH,
	VIEWPORT_PAD,
} from "./menu-position-utils";

export type SelectionMenuProps = {
	selection: SelectionSelectionMenuProps;
	documentId: string;
	actions: MenuAction[];
};

type MenuView = "actions" | "result";

export function SelectionMenu(props: SelectionMenuProps) {
	const { selection } = props;
	const selectionKey = [
		selection.context.pageIndex,
		selection.rect.origin.x,
		selection.rect.origin.y,
		selection.rect.size.width,
		selection.rect.size.height,
	].join(":");

	return <SelectionMenuContent key={selectionKey} {...props} />;
}

function SelectionMenuContent(props: SelectionMenuProps) {
	const { selection, actions } = props;
	const [view, setView] = useState<MenuView>("actions");
	const [activeAction, setActiveAction] = useState<MenuAction | null>(null);
	const [anchor, setAnchor] = useState<AnchorRect | null>(null);
	const [coords, setCoords] = useState<PopupCoords | null>(null);
	const { content, isStreaming, errorMessage, generate } =
		useGenerateTextWithPlaceholder();

	const anchorRef = useRef<HTMLDivElement | null>(null);
	const popupRef = useRef<HTMLDivElement | null>(null);

	const { ref: menuWrapperRef, ...menuWrapperProps } =
		selection.menuWrapperProps;

	const runGeneration = (action: MenuAction) => {
		void generate({
			prompt: action.prompt,
			model: action.model,
		});
	};

	const backToActions = () => {
		setActiveAction(null);
		setView("actions");
	};

	const stopSelectionGesture = (event: SyntheticEvent) => {
		event.stopPropagation();
	};

	const openResult = (action: MenuAction) => {
		setActiveAction(action);
		setView("result");
		runGeneration(action);
	};

	const refreshResult = () => {
		if (!activeAction || isStreaming) return;
		runGeneration(activeAction);
	};

	/** Set anchor position */
	useLayoutEffect(() => {
		const el = anchorRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		setAnchor({
			left: rect.left,
			top: rect.top,
			width: rect.width,
			height: rect.height,
		});
	}, []);

	/** Set popup position */
	useLayoutEffect(() => {
		const popup = popupRef.current;
		if (!anchor || !popup) return;
		const updateCoords = () => {
			const next = clampPopupPosition(
				anchor,
				popup.offsetWidth,
				popup.offsetHeight,
				selection.placement.suggestTop,
			);
			setCoords((prev) =>
				prev && prev.x === next.x && prev.y === next.y ? prev : next,
			);
		};

		updateCoords();
		const observer = new ResizeObserver(updateCoords);
		observer.observe(popup);
		return () => observer.disconnect();
	}, [anchor, selection.placement.suggestTop]);

	return (
		<div
			{...menuWrapperProps}
			ref={(el) => {
				menuWrapperRef(el);
				anchorRef.current = el;
			}}
		>
			{anchor &&
				createPortal(
					<motion.div
						ref={popupRef}
						initial={false}
						style={{
							transform: coords
								? `translate(${coords.x}px, ${coords.y}px)`
								: undefined,
						}}
						className="pointer-events-auto fixed top-0 left-0 z-50 cursor-default"
						onPointerDown={stopSelectionGesture}
						onMouseDown={stopSelectionGesture}
						onTouchStart={stopSelectionGesture}
					>
						<motion.div
							layout
							className={cn(
								"rounded-md border border-border bg-sidebar overflow-hidden",
								view === "actions" ? "p-2" : "p-0",
							)}
							style={
								view === "result"
									? {
											width: `min(${RESULT_MAX_WIDTH}px, calc(100vw - ${VIEWPORT_PAD * 2}px))`,
											minWidth: RESULT_MIN_WIDTH,
											height: `min(${RESULT_MAX_HEIGHT}px, calc(100vh - ${VIEWPORT_PAD * 2}px))`,
											minHeight: RESULT_MIN_HEIGHT,
										}
									: undefined
							}
						>
							<AnimatePresence mode="popLayout" initial={false}>
								{view === "actions" && (
									<MenuActions actions={actions} onSelectAction={openResult} />
								)}
								{view === "result" && (
									<GeneratedResult
										title={activeAction?.name ?? "Go back"}
										content={content}
										isStreaming={isStreaming}
										errorMessage={errorMessage}
										canRefresh={Boolean(activeAction)}
										onBack={backToActions}
										onRefresh={refreshResult}
									/>
								)}
							</AnimatePresence>
						</motion.div>
					</motion.div>,
					document.body,
				)}
		</div>
	);
}
