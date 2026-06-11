import { PdfActionType, type PdfBookmarkObject } from "@embedpdf/models";

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
