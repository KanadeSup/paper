import { PagePointerProvider } from "@embedpdf/plugin-interaction-manager/react";
import { RenderLayer } from "@embedpdf/plugin-render/react";
import { Scroller } from "@embedpdf/plugin-scroll/react";
import { SelectionLayer } from "@embedpdf/plugin-selection/react";
import { useRef, useState } from "react";
import { PdfChat } from "../pdf-chat/components/pdf-chat/pdf-chat";
import { useRegisterShortcut } from "../shortcut/hooks/shortcut-store";
import { useSubcribeShortcutGroup } from "../shortcut/providers/shortcut-provider";
import {
	ReaderFloatTop,
	ReaderLayout,
	ReaderMain,
	ReaderSideLeft,
	ReaderSideRight,
} from "./components/pdf-layout/pdf-reader-layout";
import { PDFLoader } from "./components/pdf-loader/pdf-loader";
import { PdfSidebar } from "./components/pdf-sidebar/pdf-sidebar";
import { PDFViewport } from "./components/pdf-viewport/pdf-viewport";
import { PersistedReaderStateProvider } from "./components/persistance/persisted-reader-state-provider";
import { ReaderScrollPersistance } from "./components/persistance/reader-scroll-persistance";
import { ReaderSidebarPersistance } from "./components/persistance/reader-sidebar-persistance";
import { ReaderZoomPersistance } from "./components/persistance/reader-zoom-persistance";
import { ReaderLoader } from "./components/reader-loader/reader-loader";
import { SelectionMenu } from "./components/selection-menu/selection-menu";
import { Toolbar } from "./components/tool-bar/tool-bar";
import { Zoom } from "./components/zoom-gesture/zoom-gesture";
import { useSelectionMenuActions } from "./hooks/use-selection-menu-actions";
import { useSmoothShortcutScroll } from "./hooks/use-smooth-shortcut-scroll";
import {
	PdfReaderProvider,
	usePdfReaderStore,
} from "./provider/pdf-reader-provider";

type PDFReaderPageProps = {
	documentId: string;
};

export function PDFReaderPage({ documentId }: PDFReaderPageProps) {
	useSubcribeShortcutGroup("pdf-reader");

	return (
		<PersistedReaderStateProvider documentId={documentId}>
			<PdfReaderProvider>
				<PDFLoader documentId={documentId}>
					{({ documentId }) => (
						<ReaderLoader documentId={documentId}>
							<PDFReaderPageContent documentId={documentId} />
						</ReaderLoader>
					)}
				</PDFLoader>
			</PdfReaderProvider>
		</PersistedReaderStateProvider>
	);
}

function PDFReaderPageContent({ documentId }: PDFReaderPageProps) {
	const [isToolbarPopupOpen, setIsToolbarPopupOpen] = useState(false);
	const { actions } = useSelectionMenuActions();
	const readerActions = usePdfReaderStore((state) => state.actions);

	const viewportRef = useRef<HTMLDivElement>(null);
	const { scrollDown, scrollUp } = useSmoothShortcutScroll(viewportRef);

	// Register the shortcut handlers for the pdf reader
	useRegisterShortcut("pdf-reader.toggle-sidebar", () => {
		readerActions.toggleSidebarOpen();
	});
	useRegisterShortcut("pdf-reader.scroll-down", scrollDown);
	useRegisterShortcut("pdf-reader.scroll-up", scrollUp);
	useRegisterShortcut("pdf-reader.toggle-pdf-chat", () => {
		readerActions.togglePdfChatOpen();
	});

	return (
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
				<PDFViewport
					documentId={documentId}
					className="h-full bg-background"
					ref={viewportRef}
				>
					<ReaderScrollPersistance documentId={documentId} />
					<ReaderZoomPersistance documentId={documentId} />
					<ReaderSidebarPersistance documentId={documentId} />
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
				</PDFViewport>
			</ReaderMain>
			<ReaderSideRight>
				<PdfChat documentId={documentId} />
			</ReaderSideRight>
		</ReaderLayout>
	);
}
