import { LibraryPage } from "@renderer/modules/library/library-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <LibraryPage />;
}
