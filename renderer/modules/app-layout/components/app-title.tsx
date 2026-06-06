import { cn, IconButton } from "@renderer/modules/design-system";
import { SidebarIcon } from "lucide-react";
import { useAppLayoutStore } from "../provider/app-layout-provider";

export type AppTitleProps = {
	children: React.ReactNode;
	className?: string;
};

export function AppTitle(props: AppTitleProps) {
	const { children, className } = props;
	const actions = useAppLayoutStore((state) => state.actions);

	return (
		<div className={cn("flex items-center gap-1 h-12", className)}>
			<IconButton onClick={() => actions.toggleSidebar()}>
				<SidebarIcon className="size-5" />
			</IconButton>
			{children}
		</div>
	);
}
