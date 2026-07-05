import { SettingPage } from "@renderer/modules/setting/setting-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setting")({
	component: RouteComponent,
});

function RouteComponent() {
	return <SettingPage />;
}
