import { useCallback, useEffect, useRef, useState } from "react";
import { clamp, cn } from "../../lib";

export type HorizontalResizableProps = {
	children: React.ReactNode;
	initialWidth?: number;
	minWidth?: number;
	maxWidth?: number;
	handlerPosition?: "left" | "right";
	isCollapsed?: boolean;
	className?: string;
	contentClassName?: string;
	handlerClassName?: string;
	onResizeFinish?: (width: number) => void;
	onWidthChange?: (width: number) => void;
};

export function HorizontalResizable(props: HorizontalResizableProps) {
	const {
		children,
		isCollapsed = false,
		handlerPosition = "right",
		initialWidth = 300,
		minWidth = 200,
		maxWidth = 500,
		className,
		contentClassName,
		handlerClassName,
		onResizeFinish,
		onWidthChange,
	} = props;

	const [width, setWidth] = useState(initialWidth);
	const [isResizing, setIsResizing] = useState(false);

	const panelRef = useRef<HTMLDivElement>(null);
	const widthRef = useRef(width);
	const animationIdRef = useRef<number | null>(null);

	widthRef.current = width;

	const updateWidth = useCallback(
		(nextWidth: number) => {
			const clamped = clamp(nextWidth, minWidth, maxWidth);
			setWidth(clamped);
			onWidthChange?.(clamped);
		},
		[minWidth, maxWidth, onWidthChange],
	);

	const startResizing = useCallback(() => {
		setIsResizing(true);
		document.body.style.cursor = "ew-resize";
		document.body.style.userSelect = "none";
	}, []);

	const stopResizing = useCallback(() => {
		setIsResizing(false);
		document.body.style.cursor = "";
		document.body.style.userSelect = "";

		// Use logical width — offsetWidth is 0 while collapsed.
		onResizeFinish?.(widthRef.current);
	}, [onResizeFinish]);

	const handleMouseDown = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			event.preventDefault();
			event.stopPropagation();
			startResizing();
		},
		[startResizing],
	);

	const handleMouseMove = useCallback(
		(event: MouseEvent) => {
			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current);
			}

			animationIdRef.current = requestAnimationFrame(() => {
				if (!panelRef.current) return;

				const panelRect = panelRef.current.getBoundingClientRect();
				const nextWidth =
					handlerPosition === "left"
						? panelRect.right - event.clientX
						: event.clientX - panelRect.left;

				updateWidth(nextWidth);
			});
		},
		[handlerPosition, updateWidth],
	);

	useEffect(() => {
		if (!isResizing) return;

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", stopResizing);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", stopResizing);

			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current);
				animationIdRef.current = null;
			}
		};
	}, [isResizing, handleMouseMove, stopResizing]);

	useEffect(() => {
		if (isCollapsed && isResizing) {
			stopResizing();
		}
	}, [isCollapsed, isResizing, stopResizing]);

	const showHandler = !isCollapsed;

	return (
		<div
			ref={panelRef}
			className={cn(
				"h-full shrink-0 overflow-hidden",
				!isResizing && "transition-[width] duration-300 ease-in-out",
				className,
			)}
			style={{ width: isCollapsed ? 0 : width }}
		>
			<div className="relative flex h-full overflow-hidden" style={{ width }}>
				{showHandler && handlerPosition === "left" && (
					<ResizableHandler
						isResizing={isResizing}
						className={handlerClassName}
						onMouseDown={handleMouseDown}
					/>
				)}

				<div
					className={cn(
						"h-full min-w-0 flex-1 overflow-hidden",
						contentClassName,
					)}
				>
					{children}
				</div>

				{showHandler && handlerPosition === "right" && (
					<ResizableHandler
						isResizing={isResizing}
						className={handlerClassName}
						onMouseDown={handleMouseDown}
					/>
				)}
			</div>
		</div>
	);
}

type ResizableHandlerProps = {
	isResizing: boolean;
	className?: string;
	onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
};

function ResizableHandler(props: ResizableHandlerProps) {
	const { isResizing, className, onMouseDown } = props;

	return (
		<div
			role="separator"
			aria-orientation="vertical"
			className={cn(
				"mx-1 h-full w-0.5 shrink-0 cursor-ew-resize",
				"transition-colors duration-200 hover:bg-blue-400",
				isResizing && "bg-blue-400",
				className,
			)}
			onMouseDown={onMouseDown}
		/>
	);
}
