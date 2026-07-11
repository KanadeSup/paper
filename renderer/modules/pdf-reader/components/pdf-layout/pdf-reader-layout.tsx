import { cn } from "@renderer/modules/design-system";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	PdfReaderLayoutProvider,
	usePdfReaderLayoutStore,
} from "./pdf-reader-layout-provider";

/* Layout */
export type ReaderLayoutProps = {
	children?: React.ReactNode;
};

export function ReaderLayout({ children }: ReaderLayoutProps) {
	return (
		<PdfReaderLayoutProvider>
			<div
				className="h-screen w-screen p-3 flex select-none"
				onDragStart={(e) => e.preventDefault()}
			>
				{children}
			</div>
		</PdfReaderLayoutProvider>
	);
}

/* Sidebar */
export type ReaderSideLeftProps = {
	children?: React.ReactNode;
	width: number;
	offset?: number;
	className?: string;
};
export function ReaderSideLeft(props: ReaderSideLeftProps) {
	const { children, width, className, offset = 16 } = props;

	const isSidebarOpen = usePdfReaderLayoutStore((state) => state.isSidebarOpen);

	return (
		<motion.aside
			initial={false}
			animate={{
				width: isSidebarOpen ? width : 0,
				marginRight: isSidebarOpen ? 12 : 0,
				opacity: isSidebarOpen ? 1 : 1,
			}}
			className="shrink-0 overflow-hidden"
		>
			<motion.div
				initial={false}
				animate={{
					x: isSidebarOpen ? 0 : -(width + offset),
				}}
				transition={{
					duration: 0.2,
					ease: "easeInOut",
				}}
				className={cn("h-full", className)}
				style={{ width }}
			>
				{children}
			</motion.div>
		</motion.aside>
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
				"flex-1 flex flex-col relative",
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
	width: number;
	offset?: number;
	className?: string;
};
export function ReaderSideRight(props: ReaderSideRightProps) {
	const { children, width, className } = props;

	const isSidebarRightOpen = usePdfReaderLayoutStore(
		(state) => state.isSidebarRightOpen,
	);

	return (
		<motion.aside
			initial={false}
			animate={{
				width: isSidebarRightOpen ? width : 0,
				marginLeft: isSidebarRightOpen ? 12 : 0,
				opacity: isSidebarRightOpen ? 1 : 1,
			}}
			className="shrink-0 overflow-hidden"
		>
			<motion.div
				initial={false}
				className={cn("h-full", className)}
				style={{ width }}
			>
				{children}
			</motion.div>
		</motion.aside>
	);
}
