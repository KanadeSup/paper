import { Outlet } from "@tanstack/react-router";
import { AppLayout } from "../app-layout";
import { SettingSidebar } from "./components/setting-sidebar";

export function SettingPage() {
	return (
		<AppLayout>
			<div className="flex gap-2">
				<SettingSidebar />
				<div className="flex-1">
					<Outlet />
				</div>
			</div>
		</AppLayout>
	);
}
