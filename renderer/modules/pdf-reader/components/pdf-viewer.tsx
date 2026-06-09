import { createPluginRegistration } from "@embedpdf/core";
import { EmbedPDF } from "@embedpdf/core/react";
import { usePdfiumEngine } from "@embedpdf/engines/react";
import {
	DocumentContent,
	DocumentManagerPluginPackage,
} from "@embedpdf/plugin-document-manager/react";
import {
	RenderLayer,
	RenderPluginPackage,
} from "@embedpdf/plugin-render/react";
import { Scroller, ScrollPluginPackage } from "@embedpdf/plugin-scroll/react";
import { SpreadPluginPackage } from "@embedpdf/plugin-spread/react";
import {
	Viewport,
	ViewportPluginPackage,
} from "@embedpdf/plugin-viewport/react";
import { ZoomPluginPackage } from "@embedpdf/plugin-zoom/react";
import { Loader2 } from "lucide-react";
import { usePdfReaderStore } from "../provider/pdf-reader-provider";
import { PdfSidebar } from "./pdf-sidebar/pdf-sidebar";
import { Toolbar } from "./tool-bar/tool-bar";

// 1. Register the plugins
const plugins = [
	createPluginRegistration(DocumentManagerPluginPackage, {
		initialDocuments: [{ url: "https://snippet.embedpdf.com/ebook.pdf" }],
	}),
	createPluginRegistration(ViewportPluginPackage),
	createPluginRegistration(ScrollPluginPackage),
	createPluginRegistration(RenderPluginPackage),
	createPluginRegistration(ZoomPluginPackage),
	createPluginRegistration(SpreadPluginPackage),
];

export const PDFViewer = () => {
	const { engine, isLoading } = usePdfiumEngine();

	const isSidebarOpen = usePdfReaderStore((state) => state.isSidebarOpen);

	if (isLoading || !engine) {
		return (
			<div className="flex h-full items-center justify-center">
				<Loader2 className="size-6 animate-spin" />
			</div>
		);
	}

	return (
		<div className="h-full select-none">
			<EmbedPDF engine={engine} plugins={plugins}>
				{({ activeDocumentId }) =>
					activeDocumentId && (
						<DocumentContent documentId={activeDocumentId}>
							{({ isLoaded }) =>
								isLoaded && (
									<div className="flex h-full w-full">
										{isSidebarOpen && <PdfSidebar />}
										<div className="relative h-full w-full">
											<Toolbar documentId={activeDocumentId} />
											<Viewport
												documentId={activeDocumentId}
												className="h-full bg-background"
											>
												<Scroller
													documentId={activeDocumentId}
													renderPage={({ width, height, pageIndex }) => (
														<div style={{ width, height }}>
															<RenderLayer
																documentId={activeDocumentId}
																pageIndex={pageIndex}
															/>
														</div>
													)}
												/>
											</Viewport>
										</div>
									</div>
								)
							}
						</DocumentContent>
					)
				}
			</EmbedPDF>
		</div>
	);
};
