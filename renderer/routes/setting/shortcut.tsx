import { SettingShortcutPage } from "@renderer/modules/setting-shortcut/setting-shortcut-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setting/shortcut")({
	component: RouteComponent,
});

function RouteComponent() {
	return <SettingShortcutPage />;
}
