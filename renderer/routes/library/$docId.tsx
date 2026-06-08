import { PDFReaderPage } from "@renderer/modules/PDFReader/PDFReaderPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/library/$docId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <PDFReaderPage />;
}
