import { PDFReaderPage } from "@renderer/modules/pdf-reader/pdf-reader-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/library/$docId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <PDFReaderPage />;
}
