import { PDFReaderPage } from "@renderer/modules/pdf-reader/pdf-reader-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/library/$docId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { docId } = Route.useParams();

	return <PDFReaderPage documentId={docId} />;
}
