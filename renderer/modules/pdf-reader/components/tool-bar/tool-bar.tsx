import { cn } from "@renderer/modules/design-system";
import { useRef, useState } from "react";
import { PageNavigation } from "./page-navigation";
import { ViewControl } from "./view-control";
import { Zoom } from "./zoom";

export type ToolbarProps = {
	className?: string;
	documentId: string;
};

export function Toolbar({ className, documentId }: ToolbarProps) {
	const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const [toolBarHovered, setToolBarHovered] = useState(false);
	const [popupOpened, setPopupOpened] = useState(false);
	const visible = toolBarHovered || popupOpened;

	const handleMouseEnter = () => {
		clearHideTimer();

		setToolBarHovered(true);
	};

	const handleMouseLeave = () => {
		clearHideTimer();

		hideTimerRef.current = setTimeout(() => {
			setToolBarHovered(false);
		}, 500);
	};

	const clearHideTimer = () => {
		if (hideTimerRef.current) {
			clearTimeout(hideTimerRef.current);
			hideTimerRef.current = null;
		}
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: toolbar wrapper uses mouse hover for show/hide
		<div
			className="absolute w-full z-10 py-2 px-4"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<div
				className={cn(
					"flex items-center justify-between gap-1 rounded-lg bg-sidebar/90 w-full",
					"px-2 py-1 transition-all duration-200 ease-out",
					!toolBarHovered && "translate-y-[-120%]",
					visible && "translate-y-0",
					className,
				)}
			>
				<div className="flex items-center gap-2">
					<PageNavigation documentId={documentId} />
				</div>

				<div>
					<Zoom
						documentId={documentId}
						onPopupOpen={() => setPopupOpened(true)}
						onPopupClose={() => setPopupOpened(false)}
					/>
				</div>

				<div>
					<ViewControl
						documentId={documentId}
						onPopupOpen={() => setPopupOpened(true)}
						onPopupClose={() => setPopupOpened(false)}
					/>
				</div>
			</div>
		</div>
	);
}
