import { createPluginRegistration } from "@embedpdf/core";
import { EmbedPDF } from "@embedpdf/core/react";
import { usePdfiumEngine } from "@embedpdf/engines/react";
import { BookmarkPluginPackage } from "@embedpdf/plugin-bookmark/react";
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
import { useDocument } from "@renderer/modules/library/hooks/useDocument";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { usePdfReaderStore } from "../provider/pdf-reader-provider";
import { PdfSidebar } from "./pdf-sidebar/pdf-sidebar";
import { Toolbar } from "./tool-bar/tool-bar";

const basePlugins = [
	createPluginRegistration(ViewportPluginPackage),
	createPluginRegistration(ScrollPluginPackage),
	createPluginRegistration(RenderPluginPackage),
	createPluginRegistration(ZoomPluginPackage),
	createPluginRegistration(SpreadPluginPackage),
	createPluginRegistration(BookmarkPluginPackage),
];

type PDFViewerProps = {
	documentId: string;
};

export const PDFViewer = ({ documentId }: PDFViewerProps) => {
	const { engine, isLoading: isEngineLoading } = usePdfiumEngine();
	const {
		document,
		isLoading: isDocumentLoading,
		error,
	} = useDocument(documentId);

	const isSidebarOpen = usePdfReaderStore((state) => state.isSidebarOpen);

	const plugins = useMemo(
		() => [
			createPluginRegistration(DocumentManagerPluginPackage, {
				initialDocuments: document
					? [
							{
								url: document.url,
								documentId: document.id,
								name: document.title || document.fileName,
							},
						]
					: [],
			}),
			...basePlugins,
		],
		[document],
	);

	if (isEngineLoading || isDocumentLoading || !engine || !document) {
		return (
			<div className="flex h-full items-center justify-center">
				{error ? (
					<p className="text-destructive text-sm">{error}</p>
				) : (
					<Loader2 className="size-6 animate-spin" />
				)}
			</div>
		);
	}

	return (
		<div className="h-full select-none">
			<EmbedPDF key={documentId} engine={engine} plugins={plugins}>
				{({ activeDocumentId }) =>
					activeDocumentId && (
						<DocumentContent documentId={activeDocumentId}>
							{({ isLoaded }) =>
								isLoaded && (
									<div className="flex h-full w-full">
										{isSidebarOpen && (
											<PdfSidebar documentId={activeDocumentId} />
										)}
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
