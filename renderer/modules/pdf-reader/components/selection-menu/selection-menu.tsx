import type { SelectionSelectionMenuProps } from "@embedpdf/plugin-selection/react";
import { cn, IconButton } from "@renderer/modules/design-system";
import { CopyIcon } from "lucide-react";

export type SelectionMenuProps = {
	selection: SelectionSelectionMenuProps;
	documentId: string;
};

export function SelectionMenu(props: SelectionMenuProps) {
	const { selection, documentId } = props;
	const top = selection.placement.suggestTop
		? -48
		: selection.rect.size.height + 8;

	return (
		<div {...selection.menuWrapperProps}>
			<div
				className={cn(
					"absolute top-[-48px] pointer-events-auto cursor-default",
					"p-2 bg-sidebar rounded-md border border-border",
				)}
				style={{ top }}
			>
				<IconButton>
					<CopyIcon />
				</IconButton>
			</div>
		</div>
	);
}
