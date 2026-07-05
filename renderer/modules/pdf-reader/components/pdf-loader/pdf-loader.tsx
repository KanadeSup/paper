import { createPluginRegistration } from "@embedpdf/core";
import { EmbedPDF } from "@embedpdf/core/react";
import { usePdfiumEngine } from "@embedpdf/engines/react";
import { BookmarkPluginPackage } from "@embedpdf/plugin-bookmark/react";
import {
	DocumentContent,
	DocumentManagerPluginPackage,
} from "@embedpdf/plugin-document-manager/react";
import { InteractionManagerPluginPackage } from "@embedpdf/plugin-interaction-manager/react";
import { RenderPluginPackage } from "@embedpdf/plugin-render/react";
import { ScrollPluginPackage } from "@embedpdf/plugin-scroll/react";
import { SelectionPluginPackage } from "@embedpdf/plugin-selection/react";
import { SpreadPluginPackage } from "@embedpdf/plugin-spread/react";
import { ViewportPluginPackage } from "@embedpdf/plugin-viewport";
import { ZoomPluginPackage } from "@embedpdf/plugin-zoom/react";
import { useDocument } from "@renderer/modules/library/hooks/useDocument";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

const basePlugins = [
	createPluginRegistration(ViewportPluginPackage),
	createPluginRegistration(ScrollPluginPackage),
	createPluginRegistration(RenderPluginPackage),
	createPluginRegistration(ZoomPluginPackage),
	createPluginRegistration(SpreadPluginPackage),
	createPluginRegistration(BookmarkPluginPackage),
	createPluginRegistration(InteractionManagerPluginPackage),
	createPluginRegistration(SelectionPluginPackage),
];

type PDFLoaderProps = {
	documentId: string;
	children: (props: { documentId: string }) => React.ReactNode;
};

export function PDFLoader({ documentId, children }: PDFLoaderProps) {
	const { engine, isLoading: isEngineLoading } = usePdfiumEngine();
	const {
		document,
		isLoading: isDocumentLoading,
		error,
	} = useDocument(documentId);

	const plugins = useMemo(() => {
		if (!document) {
			return [];
		}

		return [
			createPluginRegistration(DocumentManagerPluginPackage, {
				initialDocuments: [
					{
						url: document.url,
						documentId: document.id,
						name: document.title || document.fileName,
					},
				],
			}),
			...basePlugins,
		];
	}, [document]);

	if (isEngineLoading || isDocumentLoading || !engine || !document) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				{error ? (
					<p className="text-destructive text-sm">{error}</p>
				) : (
					<Loader2 className="size-6 animate-spin" />
				)}
			</div>
		);
	}

	return (
		<EmbedPDF key={documentId} engine={engine} plugins={plugins}>
			{({ activeDocumentId }) =>
				activeDocumentId && (
					<DocumentContent documentId={activeDocumentId}>
						{({ isLoaded }) =>
							isLoaded && children({ documentId: activeDocumentId })
						}
					</DocumentContent>
				)
			}
		</EmbedPDF>
	);
}
