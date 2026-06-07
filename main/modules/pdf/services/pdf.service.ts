import { readFile } from "node:fs/promises";
import { createNodeImageDataToBufferConverter } from "@embedpdf/engines/converters";
import { PdfEngine, PdfiumNative } from "@embedpdf/engines/pdfium";
import { init } from "@embedpdf/pdfium";
import sharp from "sharp";

export class PdfService {
	private engine: PdfEngine<Buffer<ArrayBufferLike>> | null = null;

	async getEngine() {
		if (this.engine) {
			return this.engine;
		}

		const imageConverter = createNodeImageDataToBufferConverter(sharp);

		const pdfiumModule = await init({});
		const native = new PdfiumNative(pdfiumModule);
		const engine = new PdfEngine(native, { imageConverter });
		this.engine = engine;
		return engine;
	}

	async openDocument(documentPath: string, documentId: string) {
		const engine = await this.getEngine();
		const documentBuffer = await readFile(documentPath);

		return engine
			.openDocumentBuffer({
				id: documentId,
				content: documentBuffer.buffer,
			})
			.toPromise();
	}

	async extractMetadata(documentPath: string, documentId: string) {
		const engine = await this.getEngine();
		const document = await this.openDocument(documentPath, documentId);
		const metadata = await engine.getMetadata(document).toPromise();

		return {
			title: metadata.title,
			author: metadata.author,
			totalPages: document.pageCount,
		};
	}

	async renderThumbnail(
		documentPath: string,
		documentId: string,
	): Promise<Buffer<ArrayBufferLike>> {
		const engine = await this.getEngine();
		const document = await this.openDocument(documentPath, documentId);

		if (document.pages.length === 0) {
			throw new Error("Document has no pages");
		}

		return engine.renderThumbnail(document, document.pages[0]).toPromise();
	}
}
