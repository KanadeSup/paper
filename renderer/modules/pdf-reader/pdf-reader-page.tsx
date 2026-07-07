import { PagePointerProvider } from "@embedpdf/plugin-interaction-manager/react";
import { RenderLayer } from "@embedpdf/plugin-render/react";
import { Scroller } from "@embedpdf/plugin-scroll/react";
import { SelectionLayer } from "@embedpdf/plugin-selection/react";
import { Viewport } from "@embedpdf/plugin-viewport/react";
import { useState } from "react";
import { PdfChat } from "../pdf-chat/components/pdf-chat/pdf-chat";
import {
	ReaderFloatTop,
	ReaderLayout,
	ReaderMain,
	ReaderSideLeft,
	ReaderSideRight,
} from "./components/pdf-layout/pdf-reader-layout";
import { PDFLoader } from "./components/pdf-loader/pdf-loader";
import { PdfSidebar } from "./components/pdf-sidebar/pdf-sidebar";
import { ReaderLoader } from "./components/reader-loader/reader-loader";
import { SelectionMenu } from "./components/selection-menu/selection-menu";
import { Toolbar } from "./components/tool-bar/tool-bar";
import { ZoomGesture } from "./components/zoom-gesture/zoom-gesture";
import { useSelectionMenuActions } from "./hooks/use-selection-menu-actions";
import { PdfReaderProvider } from "./provider/pdf-reader-provider";

type PDFReaderPageProps = {
	documentId: string;
};

export function PDFReaderPage({ documentId }: PDFReaderPageProps) {
	const [isToolbarPopupOpen, setIsToolbarPopupOpen] = useState(false);
	const { actions } = useSelectionMenuActions();

	return (
		<PdfReaderProvider>
			<PDFLoader documentId={documentId}>
				{({ documentId }) => (
					<ReaderLoader documentId={documentId}>
						<ReaderLayout>
							<ReaderSideLeft width={288}>
								<PdfSidebar documentId={documentId} />
							</ReaderSideLeft>
							<ReaderMain>
								<ReaderFloatTop visible={isToolbarPopupOpen}>
									<Toolbar
										documentId={documentId}
										onPopupOpen={() => setIsToolbarPopupOpen(true)}
										onPopupClose={() => setIsToolbarPopupOpen(false)}
									/>
								</ReaderFloatTop>
								<Viewport
									documentId={documentId}
									className="h-full bg-background"
								>
									<ZoomGesture documentId={documentId}>
										<Scroller
											documentId={documentId}
											renderPage={({ width, height, pageIndex }) => (
												<PagePointerProvider
													documentId={documentId}
													pageIndex={pageIndex}
												>
													<div style={{ width, height }}>
														<RenderLayer
															documentId={documentId}
															pageIndex={pageIndex}
														/>
														<SelectionLayer
															documentId={documentId}
															pageIndex={pageIndex}
															selectionMenu={(selection) => (
																<SelectionMenu
																	selection={selection}
																	documentId={documentId}
																	actions={actions}
																/>
															)}
														/>
													</div>
												</PagePointerProvider>
											)}
										/>
									</ZoomGesture>
								</Viewport>
							</ReaderMain>
							<ReaderSideRight width={384}>
								<PdfChat documentId={documentId} className="w-96" />
							</ReaderSideRight>
						</ReaderLayout>
					</ReaderLoader>
				)}
			</PDFLoader>
		</PdfReaderProvider>
	);
}
