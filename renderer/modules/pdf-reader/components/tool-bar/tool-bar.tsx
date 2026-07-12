import { cn, IconButton } from "@renderer/modules/design-system";
import { MessageCircleIcon, SidebarIcon } from "lucide-react";
import { usePdfReaderStore } from "../../provider/pdf-reader-provider";
import { PageNavigation } from "./page-navigation";
import { ViewControl } from "./view-control";
import { Zoom } from "./zoom";

export type ToolbarProps = {
	documentId: string;
	onPopupOpen?: () => void;
	onPopupClose?: () => void;
};

export function Toolbar(props: ToolbarProps) {
	const { documentId, onPopupOpen, onPopupClose } = props;

	const readerActions = usePdfReaderStore((state) => state.actions);

	return (
		<div
			className={cn(
				"flex items-center justify-between gap-1 rounded-lg bg-sidebar",
				"w-full flex items-center justify-between gap-2",
				"px-2 py-1 border border-border",
			)}
		>
			<div className="flex items-center gap-2">
				<IconButton
					variant="secondary"
					onClick={() => readerActions.toggleSidebarOpen()}
				>
					<SidebarIcon />
				</IconButton>
				<PageNavigation documentId={documentId} />
			</div>

			<div>
				<Zoom
					documentId={documentId}
					onPopupOpen={onPopupOpen}
					onPopupClose={onPopupClose}
				/>
			</div>

			<div className="flex items-center gap-2">
				<ViewControl
					documentId={documentId}
					onPopupOpen={onPopupOpen}
					onPopupClose={onPopupClose}
				/>
				<IconButton
					variant="secondary"
					onClick={() => readerActions.togglePdfChatOpen()}
				>
					<MessageCircleIcon />
				</IconButton>
			</div>
		</div>
	);
}
