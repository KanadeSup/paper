import { SettingApiKeyPage } from "@renderer/modules/setting-api-key/setting-api-key-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setting/api-keys")({
	component: RouteComponent,
});

function RouteComponent() {
	return <SettingApiKeyPage />;
}
