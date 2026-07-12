export type DocumentZoomMode = "automatic" | "fit-page" | "fit-width";
export type DocumentZoomLevel = DocumentZoomMode | number;

export type DocumentState = {
	currentPage: number;
	zoomLevel: DocumentZoomLevel;
	isPdfChatOpen: boolean;
	isSidebarOpen: boolean;
};
