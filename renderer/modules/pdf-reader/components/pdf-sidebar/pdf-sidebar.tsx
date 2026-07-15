import { IconButton } from "@renderer/modules/design-system";
import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { PdfOutline } from "./pdf-outline";

type PdfSidebarProps = {
	documentId: string;
};

export function PdfSidebar({ documentId }: PdfSidebarProps) {
	const router = useRouter();
	return (
		<div className="flex h-full min-w-0 w-full flex-col gap-2">
			<aside className="flex items-center gap-2 rounded-md bg-sidebar px-2 py-1">
				<IconButton onClick={() => router.navigate({ to: "/" })}>
					<ChevronLeft className="size-4" />
				</IconButton>
				<h2 className="font-medium">Outline</h2>
			</aside>
			<aside className="flex-1 rounded-md bg-sidebar py-3 pl-3 flex flex-col h-full">
				<PdfOutline documentId={documentId} />
			</aside>
		</div>
	);
}
