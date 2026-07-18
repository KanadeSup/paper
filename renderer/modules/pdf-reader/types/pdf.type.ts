import type { PdfBookmarkObject, PdfMetadataObject } from "@embedpdf/models";
export type PdfOutlineObject = PdfBookmarkObject & {
	startPage?: number | null;
	endPage?: number | null;
	children?: PdfOutlineObject[];
};

export type PdfMetadata = PdfMetadataObject & {
	outlines: PdfOutlineObject[];
};
