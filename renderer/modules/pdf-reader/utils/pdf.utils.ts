import { PdfActionType, type PdfBookmarkObject } from "@embedpdf/models";
import type { PdfOutlineObject } from "../types/pdf.type";

export function getBookmarkPageNumber(
	bookmark: PdfBookmarkObject,
): number | null {
	const target = bookmark.target;
	if (!target) {
		return null;
	}

	if (target.type === "destination") {
		return target.destination.pageIndex + 1;
	}

	if (target.type === "action") {
		const { action } = target;
		if (
			action.type === PdfActionType.Goto ||
			action.type === PdfActionType.RemoteGoto
		) {
			return action.destination.pageIndex + 1;
		}
	}

	return null;
}

export function resolveBookmarkStartPage(bookmarks: PdfOutlineObject[]) {
	for (const bookmark of bookmarks) {
		const startPage = getBookmarkPageNumber(bookmark);
		if (startPage) {
			bookmark.startPage = startPage;
		}
		if (bookmark.children && bookmark.children.length > 0) {
			resolveBookmarkStartPage(bookmark.children);
		}
	}
}

export function resolveBookmarkEndPage(
	bookmarks: PdfOutlineObject[],
	maxPage: number | null,
) {
	const lastBookmark = bookmarks[bookmarks.length - 1];
	if (!lastBookmark) return;
	if (maxPage) {
		lastBookmark.endPage =
			lastBookmark.startPage === maxPage ? maxPage : maxPage - 1;
	}

	for (let i = 0; i < bookmarks.length - 1; i++) {
		const bookmark = bookmarks[i];
		if (!bookmark.startPage) continue;
		const nextBookmark = bookmarks[i + 1];
		if (bookmark.children && bookmark.children.length > 0) {
			resolveBookmarkEndPage(bookmark.children, nextBookmark.startPage ?? null);
		}
		if (!nextBookmark.startPage) continue;
		if (nextBookmark.startPage === bookmark.startPage) {
			bookmark.endPage = nextBookmark.startPage;
		} else {
			bookmark.endPage = nextBookmark.startPage - 1;
		}
	}
}
