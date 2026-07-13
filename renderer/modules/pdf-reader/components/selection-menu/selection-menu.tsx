import type { SelectionSelectionMenuProps } from "@embedpdf/plugin-selection/react";
import {
	AnimatedMessage,
	Button,
	cn,
	IconButton,
	ScrollArea,
} from "@renderer/modules/design-system";
import { ErrorAlert } from "@renderer/modules/design-system/components/alert/error-alert";
import { MarkdownRenderer } from "@renderer/modules/design-system/components/markdown/markdown-renderer";
import type { MenuAction } from "@renderer/modules/setting-menu-selection/types/menu-action.type";
import { ArrowLeftIcon, CopyIcon, RefreshCcwIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type SyntheticEvent, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGenerateTextWithPlaceholder } from "../../hooks/use-generate-text-with-placeholder";

const MENU_GAP = 8;
const VIEWPORT_PAD = 30;

const RESULT_MIN_WIDTH = 280;
const RESULT_MAX_WIDTH = 420;
const RESULT_MIN_HEIGHT = 160;
const RESULT_MAX_HEIGHT = 320;

export type SelectionMenuProps = {
	selection: SelectionSelectionMenuProps;
	documentId: string;
	actions: MenuAction[];
};

type MenuView = "actions" | "result";

type AnchorRect = {
	left: number;
	top: number;
	width: number;
	height: number;
};

type PopupCoords = {
	x: number;
	y: number;
};

function clampPopupPosition(
	anchor: AnchorRect,
	popupWidth: number,
	popupHeight: number,
	suggestTop: boolean,
): PopupCoords {
	let x = anchor.left + anchor.width / 2 - popupWidth / 2;
	let y = suggestTop
		? anchor.top - MENU_GAP - popupHeight
		: anchor.top + anchor.height + MENU_GAP;

	const maxX = window.innerWidth - popupWidth - VIEWPORT_PAD;
	const maxY = window.innerHeight - popupHeight - VIEWPORT_PAD;
	x = Math.min(Math.max(VIEWPORT_PAD, x), Math.max(VIEWPORT_PAD, maxX));
	y = Math.min(Math.max(VIEWPORT_PAD, y), Math.max(VIEWPORT_PAD, maxY));

	return { x, y };
}

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
	const { content, isStreaming, errorMessage, generate, reset } =
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
		reset();
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
									<motion.div
										key="actions"
										layout
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.14 }}
										className="flex items-center gap-0.5"
									>
										<IconButton title="Copy">
											<CopyIcon />
										</IconButton>
										{actions.length > 0 && (
											<div className="mx-0.5 h-5 w-px shrink-0 bg-border" />
										)}
										{actions.map((action) => (
											<SelectionMenuActionButton
												key={action.id}
												action={action}
												onSelect={openResult}
											/>
										))}
									</motion.div>
								)}
								{view === "result" && (
									<motion.div
										key="result"
										layout
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.14 }}
										className="flex h-full flex-col"
									>
										<div className="flex justify-between items-center gap-1 border-b border-border px-2 py-1.5">
											<Button variant="ghost" onClick={backToActions}>
												<ArrowLeftIcon />
												<p className="truncate text-sm font-medium">
													{activeAction?.name ?? "Go back"}
												</p>
											</Button>
											<IconButton
												title="Refresh"
												onClick={refreshResult}
												disabled={isStreaming || !activeAction}
											>
												<RefreshCcwIcon />
											</IconButton>
										</div>
										<ScrollArea className="min-h-0 flex-1">
											<div
												className={cn(
													"prose prose-sm dark:prose-invert prose-headings:my-2 prose-p:my-2",
													"max-w-none px-3 py-2",
												)}
											>
												{errorMessage ? (
													<ErrorAlert>
														<ErrorAlert.Title>
															<ErrorAlert.Indicator />
															Something went wrong
														</ErrorAlert.Title>
														<ErrorAlert.Description>
															{errorMessage}
														</ErrorAlert.Description>
														<ErrorAlert.Footer>
															<Button
																variant="default"
																className="w-full"
																onClick={refreshResult}
																disabled={!activeAction}
															>
																<RefreshCcwIcon className="w-4 h-4" />
																Retry
															</Button>
														</ErrorAlert.Footer>
													</ErrorAlert>
												) : (
													<AnimatedMessage
														content={content}
														isStreaming={isStreaming}
													>
														{(displayedContent) => (
															<MarkdownRenderer content={displayedContent} />
														)}
													</AnimatedMessage>
												)}
											</div>
										</ScrollArea>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					</motion.div>,
					document.body,
				)}
		</div>
	);
}

function SelectionMenuActionButton({
	action,
	onSelect,
}: {
	action: MenuAction;
	onSelect: (action: MenuAction) => void;
}) {
	const Icon = action.icon;

	return (
		<IconButton title={action.name} onClick={() => onSelect(action)}>
			<Icon className="size-4" />
		</IconButton>
	);
}
