import { IconButton } from "@renderer/modules/design-system";
import type { MenuAction } from "@renderer/modules/setting-menu-selection/types/menu-action.type";
import { CopyIcon } from "lucide-react";
import { motion } from "motion/react";

type MenuActionsProps = {
	actions: MenuAction[];
	onSelectAction: (action: MenuAction) => void;
};

export function MenuActions({ actions, onSelectAction }: MenuActionsProps) {
	return (
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
				<IconButton
					key={action.id}
					title={action.name}
					onClick={() => onSelectAction(action)}
				>
					<action.icon className="size-4" />
				</IconButton>
			))}
		</motion.div>
	);
}
