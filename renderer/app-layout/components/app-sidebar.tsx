import { cn } from "@renderer/design-system/lib/utils";
import { SquareLibrary } from "lucide-react";

export type AppSidebarProps = {
	className?: string;
};

export function AppSidebar(props: AppSidebarProps) {
	const { className } = props;

	return (
		<div
			className={cn(
				"w-72 h-full bg-sidebar p-3 rounded-md shadow border border-border",
				className,
			)}
		>
			<AppSidebarHeader />
			<AppSidebarNav />
		</div>
	);
}

function AppSidebarHeader() {
	return (
		<div className="flex items-center gap-1.5">
			<SquareLibrary className="size-5" />
			<h1 className="font-semibold"> Fly Paper </h1>
		</div>
	);
}

function AppSidebarNav() {
	return <div>AppSidebarNav</div>;
}
