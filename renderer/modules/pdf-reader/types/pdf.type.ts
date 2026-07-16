import type { PdfBookmarkObject } from "@embedpdf/models";
export type PdfOutlineObject = PdfBookmarkObject & {
	startPage?: number | null;
	endPage?: number | null;
	children?: PdfOutlineObject[];
};
