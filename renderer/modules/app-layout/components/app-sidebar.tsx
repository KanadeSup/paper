import { cn } from "@renderer/modules/design-system";
import { Link, useRouter } from "@tanstack/react-router";
import { SettingsIcon, SquareLibrary } from "lucide-react";

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
		label: "Library",
		href: "/",
		icon: SquareLibrary,
	},
	{
		label: "Settings",
		href: "/settings",
		icon: SettingsIcon,
	},
];
function AppSidebarNav() {
	const router = useRouter();
	return (
		<div className="flex flex-col gap-1">
			{appSidebarNavItems.map((item) => (
				<Link
					to={item.href}
					key={item.label}
					className={cn(
						"flex items-center gap-2 cursor-pointer text-sm w-full",
						"hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md p-2",
						router.state.location.pathname === item.href &&
							"bg-sidebar-accent text-sidebar-accent-foreground",
					)}
				>
					<item.icon className="size-3" />
					<span>{item.label}</span>
				</Link>
			))}
		</div>
	);
}
