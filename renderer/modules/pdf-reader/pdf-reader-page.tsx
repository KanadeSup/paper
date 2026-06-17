import { RenderLayer } from "@embedpdf/plugin-render/react";
import { Scroller } from "@embedpdf/plugin-scroll/react";
import { Viewport } from "@embedpdf/plugin-viewport/react";
import {
	ReaderFloatTop,
	ReaderLayout,
	ReaderMain,
	ReaderSideLeft,
} from "./components/pdf-layout/pdf-reader-layout";
import { PDFLoader } from "./components/pdf-loader/pdf-loader";
import { PdfSidebar } from "./components/pdf-sidebar/pdf-sidebar";
import { Toolbar } from "./components/tool-bar/tool-bar";
import { PdfReaderProvider } from "./provider/pdf-reader-provider";

type PDFReaderPageProps = {
	documentId: string;
};

export function PDFReaderPage({ documentId }: PDFReaderPageProps) {
	return (
		<PdfReaderProvider>
			<PDFLoader documentId={documentId}>
				{({ documentId }) => (
					<ReaderLayout>
						<ReaderSideLeft width={288}>
							<PdfSidebar documentId={documentId} />
						</ReaderSideLeft>
						<ReaderMain>
							<ReaderFloatTop>
								<Toolbar documentId={documentId} />
							</ReaderFloatTop>
							<Viewport
								documentId={documentId}
								className="h-full bg-background"
							>
								<Scroller
									documentId={documentId}
									renderPage={({ width, height, pageIndex }) => (
										<div style={{ width, height }}>
											<RenderLayer
												documentId={documentId}
												pageIndex={pageIndex}
											/>
										</div>
									)}
								/>
							</Viewport>
						</ReaderMain>
					</ReaderLayout>
				)}
			</PDFLoader>
		</PdfReaderProvider>
	);
}
