import { HomeIcon, SettingsIcon, SquareLibrary } from "lucide-react";
import { cn } from "../design-system/lib/utils";

export type AppSidebarProps = {
	className?: string;
};

export function AppSidebar(props: AppSidebarProps) {
	const { className } = props;

	return (
		<div
			className={cn(
				"w-72 h-full bg-sidebar p-3 rounded-md shadow border border-border",
				"flex flex-col gap-4",
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

const appSidebarNavItems = [
	{
		label: "Home",
		href: "/",
		icon: HomeIcon,
	},
	{
		label: "Library",
		href: "/library",
		icon: SquareLibrary,
	},
	{
		label: "Settings",
		href: "/settings",
		icon: SettingsIcon,
	},
];
function AppSidebarNav() {
	return (
		<div className="flex flex-col gap-1">
			{appSidebarNavItems.map((item) => (
				<div
					key={item.href}
					className={cn(
						"flex items-center gap-2 cursor-pointer text-sm",
						"hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md p-2",
					)}
				>
					<item.icon className="size-3" />
					<span>{item.label}</span>
				</div>
			))}
		</div>
	);
}
