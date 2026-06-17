import { cn, IconButton } from "@renderer/modules/design-system";
import { SidebarIcon } from "lucide-react";
import { usePdfReaderLayoutStore } from "../pdf-layout/pdf-reader-layout-provider";
import { PageNavigation } from "./page-navigation";
import { ViewControl } from "./view-control";
import { Zoom } from "./zoom";

export type ToolbarProps = {
	documentId: string;
};

export function Toolbar(props: ToolbarProps) {
	const { documentId } = props;

	const pdfReaderLayoutActions = usePdfReaderLayoutStore(
		(state) => state.actions,
	);

	return (
		<div
			className={cn(
				"flex items-center justify-between gap-1 rounded-lg bg-sidebar",
				"w-full flex items-center justify-between gap-2",
				"px-2 py-1",
			)}
		>
			<div className="flex items-center gap-2">
				<IconButton
					variant="secondary"
					onClick={() => pdfReaderLayoutActions.toggleSidebar()}
				>
					<SidebarIcon />
				</IconButton>
				<PageNavigation documentId={documentId} />
			</div>

			<div>
				<Zoom documentId={documentId} />
			</div>

			<div>
				<ViewControl documentId={documentId} />
			</div>
		</div>
	);
}
