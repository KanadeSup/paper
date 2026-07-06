import type { SelectionSelectionMenuProps } from "@embedpdf/plugin-selection/react";
import { cn, IconButton } from "@renderer/modules/design-system";
import type { MenuAction } from "@renderer/modules/setting-menu-selection/types/menu-action.type";
import { CopyIcon } from "lucide-react";

export type SelectionMenuProps = {
	selection: SelectionSelectionMenuProps;
	documentId: string;
	actions: MenuAction[];
};

export function SelectionMenu(props: SelectionMenuProps) {
	const { selection, actions } = props;
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
				<div className="flex items-center gap-0.5">
					<IconButton title="Copy">
						<CopyIcon />
					</IconButton>
					{actions.length > 0 && (
						<div className="mx-0.5 h-5 w-px shrink-0 bg-border" />
					)}
					{actions.map((action) => (
						<SelectionMenuActionButton key={action.id} action={action} />
					))}
				</div>
			</div>
		</div>
	);
}

function SelectionMenuActionButton({ action }: { action: MenuAction }) {
	const Icon = action.icon;

	return (
		<IconButton title={action.name}>
			<Icon className="size-4" />
		</IconButton>
	);
}
