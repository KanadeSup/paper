import { PdfOutline } from "./pdf-outline";

type PdfSidebarProps = {
	documentId: string;
};

export function PdfSidebar({ documentId }: PdfSidebarProps) {
	return (
		<aside className="flex h-full w-72 shrink-0 flex-col rounded-md bg-sidebar p-3">
			<h2 className="mb-2 px-1 font-medium text-sm">Outline</h2>
			<PdfOutline documentId={documentId} />
		</aside>
	);
}
