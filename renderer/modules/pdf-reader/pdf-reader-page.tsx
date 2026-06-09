import { PDFViewer } from "./components/pdf-viewer";
import { PdfReaderProvider } from "./provider/pdf-reader-provider";

export function PDFReaderPage() {
	return (
		<PdfReaderProvider>
			<div className="h-full p-3">
				<PDFViewer />
			</div>
		</PdfReaderProvider>
	);
}
