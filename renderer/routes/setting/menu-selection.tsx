import { SelectionSettingPage } from "@renderer/modules/setting-menu-selection/selection-setting-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setting/menu-selection")({
	component: RouteComponent,
});

function RouteComponent() {
	return <SelectionSettingPage />;
}
