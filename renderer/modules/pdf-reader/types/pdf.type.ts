import type { PdfBookmarkObject } from "@embedpdf/models";
export type PdfOutlineObject = PdfBookmarkObject & {
	startPage?: number | null;
	endPage?: number | null;
	children?: PdfOutlineObject[];
};

export type PdfMetadata = {
	id: string | null;
	title: string | null;
	author: string | null;
	tags: string[] | null;
	outlines: PdfOutlineObject[];
};
