import { cn, HorizontalResizable } from "@renderer/modules/design-system";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { usePdfReaderStore } from "../../provider/pdf-reader-provider";

/* Layout */
export type ReaderLayoutProps = {
	children?: React.ReactNode;
};

export function ReaderLayout({ children }: ReaderLayoutProps) {
	return (
		<div
			className="h-screen w-screen p-3 flex select-none"
			onDragStart={(e) => e.preventDefault()}
		>
			{children}
		</div>
	);
}

/* Sidebar */
export type ReaderSideLeftProps = {
	children?: React.ReactNode;
	minWidth?: number;
	maxWidth?: number;
	className?: string;
	onResizeFinish?: (width: number) => void;
};

export function ReaderSideLeft(props: ReaderSideLeftProps) {
	const {
		children,
		minWidth = 220,
		maxWidth = 420,
		className,
		onResizeFinish,
	} = props;

	const { isSidebarOpen, sidebarWidth, actions } = usePdfReaderStore(
		useShallow((state) => ({
			isSidebarOpen: state.layout.isSidebarOpen,
			sidebarWidth: state.layout.sidebarWidth,
			actions: state.actions,
		})),
	);
	const handleResizeFinish = useCallback(
		(width: number) => {
			onResizeFinish?.(width);
			actions.setSidebarWidth(width);
		},
		[onResizeFinish, actions],
	);

	return (
		<HorizontalResizable
			isCollapsed={!isSidebarOpen}
			initialWidth={sidebarWidth}
			minWidth={minWidth}
			maxWidth={maxWidth}
			handlerPosition="right"
			onResizeFinish={handleResizeFinish}
			className={className}
		>
			<motion.div
				initial={false}
				animate={{ x: isSidebarOpen ? 0 : "-100%" }}
				transition={{ duration: 0.2, ease: "easeInOut" }}
				className="h-full w-full"
			>
				{children}
			</motion.div>
		</HorizontalResizable>
	);
}

/* Main section */
export type ReaderMainProps = {
	children?: React.ReactNode;
	className?: string;
};

export function ReaderMain({ children, className }: ReaderMainProps) {
	return (
		<motion.main
			layout
			transition={{ duration: 0.2, ease: "easeInOut" }}
			className={cn(
				"flex-1 flex flex-col relative min-w-0",
				"overflow-auto",
				className,
			)}
		>
			{children}
		</motion.main>
	);
}

/* Top bar */
export type ReaderFloatTopProps = {
	children?: React.ReactNode;
	className?: string;
	visible?: boolean;
};

export function ReaderFloatTop({
	children,
	className,
	visible,
}: ReaderFloatTopProps) {
	const [floatTopHovered, setFloatTopHovered] = useState(false);
	const [isVisible, setIsVisible] = useState(visible);

	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleMouseEnter = () => {
		clearTimer();

		setFloatTopHovered(true);
	};

	const handleMouseLeave = () => {
		clearTimer();
		delayTimer(() => setFloatTopHovered(false));
	};

	const clearTimer = useCallback(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	const delayTimer = useCallback((callback: () => void) => {
		timerRef.current = setTimeout(() => {
			callback();
		}, 500);
	}, []);

	useEffect(() => {
		if (visible) setIsVisible(true);
		else {
			clearTimer();
			delayTimer(() => setIsVisible(false));
		}

		return () => {
			clearTimer();
		};
	}, [visible, clearTimer, delayTimer]);

	return (
		<div
			className="absolute w-full z-10 pl-2 pr-6"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<div
				className={cn(
					"w-full",
					"transition-all duration-200 ease-out",
					!floatTopHovered && "translate-y-[-120%]",
					isVisible && "translate-y-0",
					visible && "translate-y-0",
					className,
				)}
			>
				{children}
			</div>
		</div>
	);
}

/* Side right */
export type ReaderSideRightProps = {
	children?: React.ReactNode;
	minWidth?: number;
	maxWidth?: number;
	className?: string;
	onResizeFinish?: (width: number) => void;
};

export function ReaderSideRight(props: ReaderSideRightProps) {
	const {
		children,
		minWidth = 280,
		maxWidth = 560,
		className,
		onResizeFinish,
	} = props;

	const { isSidebarRightOpen, pdfChatWidth, actions } = usePdfReaderStore(
		useShallow((state) => ({
			isSidebarRightOpen: state.layout.isPdfChatOpen,
			pdfChatWidth: state.layout.pdfChatWidth,
			actions: state.actions,
		})),
	);

	const handleResizeFinish = useCallback(
		(width: number) => {
			onResizeFinish?.(width);
			actions.setPdfChatWidth(width);
		},
		[onResizeFinish, actions],
	);

	return (
		<HorizontalResizable
			isCollapsed={!isSidebarRightOpen}
			initialWidth={pdfChatWidth}
			minWidth={minWidth}
			maxWidth={maxWidth}
			handlerPosition="left"
			onResizeFinish={handleResizeFinish}
			className={className}
		>
			<div className="h-full w-full">{children}</div>
		</HorizontalResizable>
	);
}
