import { cn } from "@renderer/modules/design-system";
import { Link, useLocation, useRouter } from "@tanstack/react-router";

export function SettingSidebar() {
	const navItems = [
		{
			label: "General",
			href: "/setting/general",
		},
		{
			label: "Appearance",
			href: "/setting/appearance",
		},
		{
			label: "API keys",
			href: "/setting/api-keys",
		},
		{
			label: "Menu selection",
			href: "/setting/menu-selection",
		},
	];
	const location = useLocation();
	return (
		<div className="flex flex-col gap-4 w-64 p-3">
			<h1 className="font-semibold"> Settings </h1>
			<div className="flex flex-col gap-1">
				{navItems.map((item) => (
					<Link
						key={item.href}
						to={item.href}
						className={cn(
							"flex items-center gap-2 cursor-pointer text-sm w-full",
							"hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md p-2",
							location.pathname === item.href &&
								"bg-sidebar-accent text-sidebar-accent-foreground",
						)}
					>
						{item.label}
					</Link>
				))}
			</div>
		</div>
	);
}
