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
import { ReaderScrollPersistance } from "./components/reader-scroll-persistance/reader-scroll-persistance";
import { ReaderZoomPersistance } from "./components/reader-zoom-persistance/reader-zoom-persistance";
import { SelectionMenu } from "./components/selection-menu/selection-menu";
import { Toolbar } from "./components/tool-bar/tool-bar";
import { Zoom } from "./components/zoom-gesture/zoom-gesture";
import { useSelectionMenuActions } from "./hooks/use-selection-menu-actions";
import { PdfReaderProvider } from "./provider/pdf-reader-provider";
import { PersistedReaderStateProvider } from "./provider/persisted-reader-state-provider";

type PDFReaderPageProps = {
	documentId: string;
};

export function PDFReaderPage({ documentId }: PDFReaderPageProps) {
	const [isToolbarPopupOpen, setIsToolbarPopupOpen] = useState(false);
	const { actions } = useSelectionMenuActions();

	return (
		<PersistedReaderStateProvider documentId={documentId}>
			<PdfReaderProvider documentId={documentId}>
				<PDFLoader documentId={documentId}>
					{({ documentId }) => (
						<ReaderLoader documentId={documentId}>
							<ReaderLayout>
								<ReaderSideLeft>
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
										<ReaderScrollPersistance documentId={documentId} />
										<ReaderZoomPersistance documentId={documentId} />
										<Zoom documentId={documentId}>
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
										</Zoom>
									</Viewport>
								</ReaderMain>
								<ReaderSideRight>
									<PdfChat documentId={documentId} />
								</ReaderSideRight>
							</ReaderLayout>
						</ReaderLoader>
					)}
				</PDFLoader>
			</PdfReaderProvider>
		</PersistedReaderStateProvider>
	);
}
