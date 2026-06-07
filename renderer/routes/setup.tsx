import { SetupPage } from "@renderer/modules/app-config";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setup")({
	component: SetupPage,
});
