import { cn, IconButton } from "@renderer/modules/design-system";
import { PencilIcon, PowerIcon, Trash2Icon } from "lucide-react";
import type { MenuAction } from "../types/menu-action.type";

function formatDate(date: Date): string {
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export type ActionItemProps = {
	action: MenuAction;
	onEdit: () => void;
	onToggle: () => void;
	onDelete: () => void;
};

export function ActionItem({
	action,
	onEdit,
	onToggle,
	onDelete,
}: ActionItemProps) {
	const Icon = action.icon;

	return (
		<div
			className={cn(
				"group flex items-center gap-3 p-3 rounded-lg",
				"border border-border bg-card",
				"transition-colors duration-150",
				"hover:bg-accent/20 hover:border-border/80",
				!action.enabled && "opacity-55",
			)}
		>
			<div className="flex items-center justify-center size-9 rounded-md shrink-0 bg-primary/10 text-primary">
				<Icon className="size-4" />
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 flex-wrap">
					<span className="font-medium text-sm leading-none">
						{action.name}
					</span>
					{!action.enabled && (
						<span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm leading-none">
							Disabled
						</span>
					)}
				</div>
				<p className="text-xs text-muted-foreground mt-1 truncate">
					{action.description}
				</p>
				<p className="text-[11px] text-muted-foreground/50 mt-1">
					Created {formatDate(action.createdAt)}
				</p>
			</div>

			<div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
				<IconButton
					onClick={onEdit}
					size="icon-sm"
					className="text-muted-foreground hover:text-foreground transition-colors duration-150"
					title="Edit action"
				>
					<PencilIcon className="size-3.5" />
				</IconButton>
				<IconButton
					onClick={onToggle}
					size="icon-sm"
					className={cn(
						"transition-colors duration-150",
						action.enabled
							? "text-primary hover:text-primary/80 hover:bg-primary/10"
							: "text-muted-foreground",
					)}
					title={action.enabled ? "Disable action" : "Enable action"}
				>
					<PowerIcon className="size-3.5" />
				</IconButton>
				<IconButton
					onClick={onDelete}
					size="icon-sm"
					className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-150"
					title="Delete action"
				>
					<Trash2Icon className="size-3.5" />
				</IconButton>
			</div>
		</div>
	);
}
