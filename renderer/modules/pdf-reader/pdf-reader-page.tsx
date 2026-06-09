import { PDFViewer } from "./components/pdf-viewer";
import { PdfReaderProvider } from "./provider/pdf-reader-provider";

type PDFReaderPageProps = {
	documentId: string;
};

export function PDFReaderPage({ documentId }: PDFReaderPageProps) {
	return (
		<PdfReaderProvider>
			<div className="h-full p-3">
				<PDFViewer documentId={documentId} />
			</div>
		</PdfReaderProvider>
	);
}
