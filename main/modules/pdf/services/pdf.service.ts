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

	async getDocument(documentPath: string) {
		const engine = await this.getEngine();
		const documentBuffer = await readFile(documentPath);
		const documentId = crypto.randomUUID();

		const document = await engine
			.openDocumentBuffer({
				id: documentId,
				content: documentBuffer.buffer,
			})
			.toPromise();

		return document;
	}
}
