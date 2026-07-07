import type { PdfOutlineObject } from "./pdf.type";

export type RagEngine = "openai" | "builtin";

export type ContextEngine =
	| { type: "rag"; engine: RagEngine }
	| { type: "outline"; outlineItem: PdfOutlineObject }
	| null;
